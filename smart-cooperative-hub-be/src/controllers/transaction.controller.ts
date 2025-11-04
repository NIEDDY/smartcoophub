import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { TransactionType, UserRole } from '../lib/enums';
import { ApiError } from '../lib/ApiError';

export class TransactionController {
  /**
   * Creates a new financial transaction for a cooperative.
   * If 'requiresApproval' is true, the transaction is created in a PENDING state
   * and requires a second approval. Otherwise, it is auto-approved.
   * Auto-approved transactions for members (CONTRIBUTION, DIVIDEND, LOAN, LOAN_REPAYMENT)
   * will immediately update the member's financial record.
   * @param req - The authenticated request object, containing user and cooperative info.
   * @param res - The response object.
   */
  static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user || !req.user.cooperativeId) {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      const { type, amount, description, category, reference, requiresApproval, userId } = req.body;
      const cooperativeId = req.user.cooperativeId;

      // Check if user has permission to create transactions
      if (![UserRole.COOP_ADMIN, UserRole.ACCOUNTANT, UserRole.SECRETARY].includes(req.user.role as UserRole)) {
        res.status(403).json({ error: 'Insufficient permissions' });
        return;
      }

      const transaction = await prisma.transaction.create({
        data: {
          cooperativeId,
          userId: userId || req.user.id,
          type: type as TransactionType,
          amount: parseFloat(amount),
          description,
          category,
          reference,
          requiresApproval: requiresApproval || false,
          isApproved: requiresApproval ? false : true,
          approvedBy: requiresApproval ? [] : [req.user.id],
        },
      });

      // Update member financial if it's a member transaction
      if (userId && [TransactionType.CONTRIBUTION, TransactionType.DIVIDEND, TransactionType.LOAN, TransactionType.LOAN_REPAYMENT].includes(type as TransactionType)) {
        const memberFinancial = await prisma.memberFinancial.findUnique({
          where: { memberId: userId },
        });

        if (memberFinancial) {
          const updates: any = {};
          
          switch (type as TransactionType) {
            case TransactionType.CONTRIBUTION:
              updates.contributions = memberFinancial.contributions + parseFloat(amount);
              break;
            case TransactionType.DIVIDEND:
              updates.dividends = memberFinancial.dividends + parseFloat(amount);
              break;
            case TransactionType.LOAN:
              updates.loans = memberFinancial.loans + parseFloat(amount);
              break;
            case TransactionType.LOAN_REPAYMENT:
              updates.loans = Math.max(0, memberFinancial.loans - parseFloat(amount));
              break;
          }

          await prisma.memberFinancial.update({
            where: { memberId: userId },
            data: updates,
          });
        } else {
          // Create financial record if doesn't exist
          await prisma.memberFinancial.create({
            data: {
              memberId: userId,
              cooperativeId,
              contributions: (type as TransactionType) === TransactionType.CONTRIBUTION ? parseFloat(amount) : 0,
              dividends: (type as TransactionType) === TransactionType.DIVIDEND ? parseFloat(amount) : 0,
              loans: (type as TransactionType) === TransactionType.LOAN ? parseFloat(amount) : 0,
            },
          });
        }
      }

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: req.user.id,
          cooperativeId,
          action: 'TRANSACTION_CREATED',
          entity: 'TRANSACTION',
          entityId: transaction.id,
          details: { type, amount, description },
        },
      });

      res.status(201).json({
        message: 'Transaction created successfully',
        transaction,
      });
    } catch (error: any) {
      console.error('Create transaction error:', error);
      res.status(500).json({ error: 'Failed to create transaction' });
    }
  }

  static async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user || !req.user.cooperativeId) {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      const { type, startDate, endDate, page = 1, limit = 20 } = req.query;
      const cooperativeId = req.user.cooperativeId;

      const where: any = { cooperativeId };
      
      if (type) where.type = type;
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate as string);
        if (endDate) where.createdAt.lte = new Date(endDate as string);
      }

      const skip = (Number(page) - 1) * Number(limit);

      const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
          where,
          skip,
          take: Number(limit),
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.transaction.count({ where }),
      ]);

      res.json({
        transactions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error: any) {
      console.error('Get transactions error:', error);
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  }

  static async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user || !req.user.cooperativeId) {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      const { id } = req.params;
      const user = req.user;

      const transaction = await prisma.transaction.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          cooperative: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!transaction) {
        res.status(404).json({ error: 'Transaction not found' });
        return;
      }

      const tx = transaction;

      // Check authorization
      if (user.cooperativeId !== tx.cooperativeId && user.role !== UserRole.SUPER_ADMIN) {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      res.json({ transaction: tx });
    } catch (error: any) {
      console.error('Get transaction error:', error);
      res.status(500).json({ error: 'Failed to fetch transaction' });
    }
  }

  static async approve(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!req.user || ![UserRole.COOP_ADMIN, UserRole.SECRETARY].includes(req.user.role as UserRole)) {
        res.status(403).json({ error: 'Not authorized to approve transactions' });
        return;
      }

      const transaction = await prisma.transaction.findUnique({
        where: { id },
      });

      if (!transaction) {
        res.status(404).json({ error: 'Transaction not found' });
        return;
      }

      if (transaction.cooperativeId !== req.user.cooperativeId) {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      if (!transaction.requiresApproval) {
        res.status(400).json({ error: 'Transaction does not require approval' });
        return;
      }

      if (transaction.isApproved) {
        res.status(400).json({ error: 'Transaction already approved' });
        return;
      }

      // Add approver
      const approvedBy = [...transaction.approvedBy, req.user.id];
      
      // Check if we have enough approvals (require 2 approvals)
      const isApproved = approvedBy.length >= 2;

      const updatedTransaction = await prisma.transaction.update({
        where: { id },
        data: {
          approvedBy,
          isApproved,
        },
      });

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: req.user.id,
          cooperativeId: req.user.cooperativeId,
          action: isApproved ? 'TRANSACTION_APPROVED' : 'TRANSACTION_PARTIAL_APPROVAL',
          entity: 'TRANSACTION',
          entityId: id,
        },
      });

      res.json({
        message: isApproved ? 'Transaction approved successfully' : 'Approval recorded, awaiting additional approval',
        transaction: updatedTransaction,
      });
    } catch (error: any) {
      console.error('Approve transaction error:', error);
      res.status(500).json({ error: 'Failed to approve transaction' });
    }
  }

  static async getSummary(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user || !req.user.cooperativeId) {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      const cooperativeId = req.user.cooperativeId;
      const { startDate, endDate } = req.query;

      const where: any = { cooperativeId, isApproved: true };
      
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate as string);
        if (endDate) where.createdAt.lte = new Date(endDate as string);
      }

      const [income, expenses, contributions, loans] = await Promise.all([
        prisma.transaction.aggregate({
          where: { ...where, type: TransactionType.INCOME },
          _sum: { amount: true },
          _count: true,
        }),
        prisma.transaction.aggregate({
          where: { ...where, type: TransactionType.EXPENSE },
          _sum: { amount: true },
          _count: true,
        }),
        prisma.transaction.aggregate({
          where: { ...where, type: TransactionType.CONTRIBUTION },
          _sum: { amount: true },
          _count: true,
        }),
        prisma.transaction.aggregate({
          where: { ...where, type: TransactionType.LOAN },
          _sum: { amount: true },
          _count: true,
        }),
      ]);

      res.json({
        summary: {
          income: {
            total: income._sum.amount || 0,
            count: income._count,
          },
          expenses: {
            total: expenses._sum.amount || 0,
            count: expenses._count,
          },
          contributions: {
            total: contributions._sum.amount || 0,
            count: contributions._count,
          },
          loans: {
            total: loans._sum.amount || 0,
            count: loans._count,
          },
          netBalance: (income._sum.amount || 0) - (expenses._sum.amount || 0),
        },
      });
    } catch (error: any) {
      console.error('Get transaction summary error:', error);
      res.status(500).json({ error: 'Failed to fetch transaction summary' });
    }
  }
}