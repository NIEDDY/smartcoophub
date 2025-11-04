import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { UploadService } from '../services/upload.service';

export class CooperativeController {
  static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const cooperativeData = req.body;
      
      console.log('Creating cooperative with data:', cooperativeData);

      // Validate required fields
      if (!cooperativeData.registrationNumber) {
        res.status(400).json({ error: 'Registration number is required' });
        return;
      }

      // Check if registration number exists
      const existing = await prisma.cooperative.findUnique({
        where: { registrationNumber: cooperativeData.registrationNumber },
      });

      if (existing) {
        res.status(400).json({ error: 'Cooperative with this registration number already exists' });
        return;
      }

      // Upload files if provided
      let logo, certificateUrl, constitutionUrl;
      
      if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        
        try {
          if (files.logo) {
            logo = await UploadService.uploadImage(files.logo[0], 'cooperatives/logos');
            console.log('Logo uploaded:', logo);
          }
          if (files.certificate) {
            certificateUrl = await UploadService.uploadDocument(files.certificate[0], 'cooperatives/certificates');
            console.log('Certificate uploaded:', certificateUrl);
          }
          if (files.constitution) {
            constitutionUrl = await UploadService.uploadDocument(files.constitution[0], 'cooperatives/constitutions');
            console.log('Constitution uploaded:', constitutionUrl);
          }
        } catch (uploadError: any) {
          console.error('File upload error:', uploadError);
          res.status(400).json({ error: 'File upload failed: ' + uploadError.message });
          return;
        }
      }

      // Parse foundedDate if it's a string
      let foundedDate = cooperativeData.foundedDate;
      if (foundedDate && typeof foundedDate === 'string') {
        foundedDate = new Date(foundedDate);
      }

      // Create cooperative
      console.log('About to create cooperative with data:', JSON.stringify({
        name: cooperativeData.name,
        registrationNumber: cooperativeData.registrationNumber,
        email: cooperativeData.email,
        phone: cooperativeData.phone,
        address: cooperativeData.address,
        district: cooperativeData.district,
        sector: cooperativeData.sector,
        cell: cooperativeData.cell,
        village: cooperativeData.village,
        type: cooperativeData.type,
        description: cooperativeData.description || null,
        foundedDate: foundedDate || null,
      }));
      
      const cooperative = await prisma.cooperative.create({
        data: {
          name: cooperativeData.name,
          registrationNumber: cooperativeData.registrationNumber,
          email: cooperativeData.email,
          phone: cooperativeData.phone,
          address: cooperativeData.address,
          district: cooperativeData.district,
          sector: cooperativeData.sector,
          cell: cooperativeData.cell,
          village: cooperativeData.village,
          type: cooperativeData.type,
          description: cooperativeData.description || null,
          logo: logo || null,
          certificateUrl: certificateUrl || null,
          constitutionUrl: constitutionUrl || null,
          foundedDate: foundedDate || null,
          status: 'PENDING',
        },
      });

      console.log('✅ Cooperative CREATED in DB:', JSON.stringify({
        id: cooperative.id,
        name: cooperative.name,
        registrationNumber: cooperative.registrationNumber,
        status: cooperative.status,
        createdAt: cooperative.createdAt,
      }));

      // Verify it was actually created by fetching it back
      const verifyCreated = await prisma.cooperative.findUnique({
        where: { id: cooperative.id },
      });
      
      if (verifyCreated) {
        console.log('✅✅ VERIFIED: Cooperative exists in database');
      } else {
        console.error('❌ ERROR: Created cooperative not found in database!');
      }

      // Update user to be admin of this cooperative
      await prisma.user.update({
        where: { id: req.user.id },
        data: {
          cooperativeId: cooperative.id,
          role: 'COOP_ADMIN',
        },
      });

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: req.user.id,
          cooperativeId: cooperative.id,
          action: 'COOPERATIVE_CREATED',
          entity: 'COOPERATIVE',
          entityId: cooperative.id,
        },
      });

      res.status(201).json({
        message: 'Cooperative created successfully. Awaiting approval.',
        data: cooperative,
      });
    } catch (error: any) {
      console.error('Create cooperative error:', error);
      
      // Handle Prisma unique constraint violations
      if (error.code === 'P2002') {
        const field = error.meta?.target?.[0] || 'field';
        res.status(400).json({ 
          error: `A cooperative with this ${field} already exists`,
          field,
        });
        return;
      }
      
      // Handle missing required fields
      if (error.code === 'P2011' || error.message?.includes('null')) {
        res.status(400).json({ 
          error: 'Missing required fields',
          details: error.message,
        });
        return;
      }
      
      res.status(500).json({ 
        error: 'Failed to create cooperative',
        details: error.message,
      });
    }
  }

  static async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { status, type, page = 1, limit = 20 } = req.query;

      const where: any = {};
      
      if (status) where.status = status;
      if (type) where.type = type;

      const skip = (Number(page) - 1) * Number(limit);

      const [cooperatives, total] = await Promise.all([
        prisma.cooperative.findMany({
          where,
          skip,
          take: Number(limit),
          include: {
            _count: {
              select: {
                users: true,
                products: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.cooperative.count({ where }),
      ]);

      res.json({
        cooperatives,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error: any) {
      console.error('Get cooperatives error:', error);
      res.status(500).json({ error: 'Failed to fetch cooperatives' });
    }
  }

  static async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const cooperative = await prisma.cooperative.findUnique({
        where: { id },
        include: {
          users: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
              avatar: true,
            },
          },
          products: {
            take: 10,
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: {
              users: true,
              products: true,
              transactions: true,
              announcements: true,
            },
          },
        },
      });

      if (!cooperative) {
        res.status(404).json({ error: 'Cooperative not found' });
        return;
      }

      res.json({ cooperative });
    } catch (error: any) {
      console.error('Get cooperative error:', error);
      res.status(500).json({ error: 'Failed to fetch cooperative' });
    }
  }

  static async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Upload new files if provided
      if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        
        if (files.logo) {
          updateData.logo = await UploadService.uploadImage(files.logo[0], 'cooperatives/logos');
        }
        if (files.certificate) {
          updateData.certificateUrl = await UploadService.uploadDocument(files.certificate[0], 'cooperatives/certificates');
        }
        if (files.constitution) {
          updateData.constitutionUrl = await UploadService.uploadDocument(files.constitution[0], 'cooperatives/constitutions');
        }
      }

      const cooperative = await prisma.cooperative.update({
        where: { id },
        data: updateData,
      });

      // Log activity
      if (req.user) {
        await prisma.activityLog.create({
          data: {
            userId: req.user.id,
            cooperativeId: id,
            action: 'COOPERATIVE_UPDATED',
            entity: 'COOPERATIVE',
            entityId: id,
            details: updateData,
          },
        });
      }

      res.json({ message: 'Cooperative updated successfully', cooperative });
    } catch (error: any) {
      console.error('Update cooperative error:', error);
      res.status(500).json({ error: 'Failed to update cooperative' });
    }
  }

  static async approve(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!req.user || req.user.role !== 'SUPER_ADMIN') {
        res.status(403).json({ error: 'Only Super Admin can approve cooperatives' });
        return;
      }

      const cooperative = await prisma.cooperative.update({
        where: { id },
        data: {
          status: 'APPROVED',
          verifiedBy: req.user.id,
          verifiedAt: new Date(),
        },
      });

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: req.user.id,
          cooperativeId: id,
          action: 'COOPERATIVE_APPROVED',
          entity: 'COOPERATIVE',
          entityId: id,
        },
      });

      res.json({ message: 'Cooperative approved successfully', cooperative });
    } catch (error: any) {
      console.error('Approve cooperative error:', error);
      res.status(500).json({ error: 'Failed to approve cooperative' });
    }
  }

  static async reject(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      if (!req.user || req.user.role !== 'SUPER_ADMIN') {
        res.status(403).json({ error: 'Only Super Admin can reject cooperatives' });
        return;
      }

      const cooperative = await prisma.cooperative.update({
        where: { id },
        data: {
          status: 'REJECTED',
          verifiedBy: req.user.id,
          verifiedAt: new Date(),
        },
      });

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: req.user.id,
          cooperativeId: id,
          action: 'COOPERATIVE_REJECTED',
          entity: 'COOPERATIVE',
          entityId: id,
          details: { reason },
        },
      });

      res.json({ message: 'Cooperative rejected', cooperative });
    } catch (error: any) {
      console.error('Reject cooperative error:', error);
      res.status(500).json({ error: 'Failed to reject cooperative' });
    }
  }

  static async suspend(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      if (!req.user || req.user.role !== 'SUPER_ADMIN') {
        res.status(403).json({ error: 'Only Super Admin can suspend cooperatives' });
        return;
      }

      const cooperative = await prisma.cooperative.update({
        where: { id },
        data: { status: 'SUSPENDED' },
      });

      // Deactivate all users in this cooperative
      await prisma.user.updateMany({
        where: { cooperativeId: id },
        data: { isActive: false },
      });

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: req.user.id,
          cooperativeId: id,
          action: 'COOPERATIVE_SUSPENDED',
          entity: 'COOPERATIVE',
          entityId: id,
          details: { reason },
        },
      });

      res.json({ message: 'Cooperative suspended', cooperative });
    } catch (error: any) {
      console.error('Suspend cooperative error:', error);
      res.status(500).json({ error: 'Failed to suspend cooperative' });
    }
  }

  static async getDashboard(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { cooperativeId } = req.params;

      const [cooperative, stats] = await Promise.all([
        prisma.cooperative.findUnique({
          where: { id: cooperativeId },
        }),
        prisma.$transaction([
          prisma.user.count({ where: { cooperativeId } }),
          prisma.product.count({ where: { cooperativeId } }),
          prisma.transaction.aggregate({
            where: { cooperativeId, type: 'INCOME' },
            _sum: { amount: true },
          }),
          prisma.transaction.aggregate({
            where: { cooperativeId, type: 'EXPENSE' },
            _sum: { amount: true },
          }),
          prisma.request.count({
            where: { cooperativeId, status: 'PENDING' },
          }),
        ]),
      ]);

      const [totalMembers, totalProducts, income, expenses, pendingRequests] = stats;

      res.json({
        cooperative,
        stats: {
          totalMembers,
          totalProducts,
          totalIncome: income._sum.amount || 0,
          totalExpenses: expenses._sum.amount || 0,
          netBalance: (income._sum.amount || 0) - (expenses._sum.amount || 0),
          pendingRequests,
        },
      });
    } catch (error: any) {
      console.error('Get dashboard error:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  }
}