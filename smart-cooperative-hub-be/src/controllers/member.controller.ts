import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { CSVService } from '../services/csv.service';
import { EmailService } from '../services/email.service';
import { config } from '../config';
import crypto from 'crypto';

export class MemberController {
  static async inviteMember(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user || !req.user.cooperativeId) {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      const { email, role } = req.body;
      const cooperativeId = req.user.cooperativeId;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser && existingUser.cooperativeId) {
        res.status(400).json({ error: 'User already belongs to a cooperative' });
        return;
      }

      // Check if invitation already sent
      const existingInvitation = await prisma.invitation.findFirst({
        where: {
          email,
          cooperativeId,
          usedAt: null,
          expiresAt: { gt: new Date() },
        },
      });

      if (existingInvitation) {
        res.status(400).json({ error: 'Invitation already sent to this email' });
        return;
      }

      // Get cooperative details
      const cooperative = await prisma.cooperative.findUnique({
        where: { id: cooperativeId },
        select: { name: true },
      });

      if (!cooperative) {
        res.status(404).json({ error: 'Cooperative not found' });
        return;
      }

      // Generate invitation token
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      // Create invitation
      const invitation = await prisma.invitation.create({
        data: {
          email,
          cooperativeId,
          role,
          token,
          expiresAt,
          invitedBy: req.user.id,
        },
      });

      // Send invitation email
      const inviteLink = `${config.frontend.url}/accept-invitation?token=${token}`;
      await EmailService.sendInvitationEmail(email, cooperative.name, role, inviteLink);

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: req.user.id,
          cooperativeId,
          action: 'MEMBER_INVITED',
          entity: 'INVITATION',
          entityId: invitation.id,
          details: { email, role },
        },
      });

      res.status(201).json({
        message: 'Invitation sent successfully',
        invitation: {
          id: invitation.id,
          email: invitation.email,
          role: invitation.role,
          expiresAt: invitation.expiresAt,
        },
      });
    } catch (error: any) {
      console.error('Invite member error:', error);
      res.status(500).json({ error: 'Failed to send invitation' });
    }
  }

  static async importMembers(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user || !req.user.cooperativeId) {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ error: 'CSV file is required' });
        return;
      }

      const cooperativeId = req.user.cooperativeId;

      // Import members from CSV
      const result = await CSVService.importMembers(
        cooperativeId,
        req.user.id,
        req.file.buffer
      );

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: req.user.id,
          cooperativeId,
          action: 'MEMBERS_IMPORTED',
          entity: 'USER',
          details: {
            success: result.success,
            failed: result.failed,
          },
        },
      });

      res.json({
        message: 'Import completed',
        result,
      });
    } catch (error: any) {
      console.error('Import members error:', error);
      res.status(500).json({ error: 'Failed to import members' });
    }
  }

  static async acceptInvitation(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { token, password, phone } = req.body;

      const user = await CSVService.acceptInvitation(token, password, { phone });

      // Generate JWT token
      const authToken = crypto.randomBytes(32).toString('hex');

      res.json({
        message: 'Invitation accepted successfully. Welcome to the cooperative!',
        token: authToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          cooperativeId: user.cooperativeId,
        },
      });
    } catch (error: any) {
      console.error('Accept invitation error:', error);
      res.status(400).json({ error: error.message || 'Failed to accept invitation' });
    }
  }

  static async getMembers(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user || !req.user.cooperativeId) {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      const { role, page = 1, limit = 20, search } = req.query;
      const cooperativeId = req.user.cooperativeId;

      const where: any = { cooperativeId };
      
      if (role) where.role = role;
      if (search) {
        where.OR = [
          { firstName: { contains: search as string, mode: 'insensitive' } },
          { lastName: { contains: search as string, mode: 'insensitive' } },
          { email: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      const skip = (Number(page) - 1) * Number(limit);

      const [members, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: Number(limit),
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            role: true,
            avatar: true,
            isActive: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({ where }),
      ]);

      res.json({
        members,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error: any) {
      console.error('Get members error:', error);
      res.status(500).json({ error: 'Failed to fetch members' });
    }
  }

  static async getMemberById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const member = await prisma.user.findUnique({
        where: { id },
        include: {
          cooperative: {
            select: {
              id: true,
              name: true,
              logo: true,
            },
          },
        },
      });

      if (!member) {
        res.status(404).json({ error: 'Member not found' });
        return;
      }

      // Check authorization
      if (req.user?.role !== 'SUPER_ADMIN' && 
          req.user?.cooperativeId !== member.cooperativeId &&
          req.user?.id !== member.id) {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      // Get financial data if member
      let financialData = null;
      if (member.role === 'MEMBER' || member.role === 'SECRETARY' || member.role === 'ACCOUNTANT') {
        financialData = await prisma.memberFinancial.findUnique({
          where: { memberId: member.id },
        });
      }

      res.json({
        member: {
          ...member,
          password: undefined,
        },
        financialData,
      });
    } catch (error: any) {
      console.error('Get member error:', error);
      res.status(500).json({ error: 'Failed to fetch member' });
    }
  }

  static async updateMember(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { firstName, lastName, phone, role, isActive } = req.body;

      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      // Check authorization
      const member = await prisma.user.findUnique({
        where: { id },
      });

      if (!member) {
        res.status(404).json({ error: 'Member not found' });
        return;
      }

      if (req.user.role !== 'SUPER_ADMIN' && 
          req.user.role !== 'COOP_ADMIN' &&
          req.user.cooperativeId !== member.cooperativeId) {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      const updateData: any = {};
      if (firstName) updateData.firstName = firstName;
      if (lastName) updateData.lastName = lastName;
      if (phone) updateData.phone = phone;
      if (role && req.user.role === 'COOP_ADMIN') updateData.role = role;
      if (typeof isActive === 'boolean' && req.user.role === 'COOP_ADMIN') {
        updateData.isActive = isActive;
      }

      const updatedMember = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
        },
      });

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: req.user.id,
          cooperativeId: req.user.cooperativeId,
          action: 'MEMBER_UPDATED',
          entity: 'USER',
          entityId: id,
          details: updateData,
        },
      });

      res.json({ message: 'Member updated successfully', member: updatedMember });
    } catch (error: any) {
      console.error('Update member error:', error);
      res.status(500).json({ error: 'Failed to update member' });
    }
  }

  static async removeMember(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!req.user || (req.user.role !== 'COOP_ADMIN' && req.user.role !== 'SUPER_ADMIN')) {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      const member = await prisma.user.findUnique({
        where: { id },
      });

      if (!member) {
        res.status(404).json({ error: 'Member not found' });
        return;
      }

      if (req.user.role !== 'SUPER_ADMIN' && req.user.cooperativeId !== member.cooperativeId) {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      // Remove member from cooperative (set cooperativeId to null)
      await prisma.user.update({
        where: { id },
        data: {
          cooperativeId: null,
          isActive: false,
        },
      });

      // Update cooperative member count
      if (member.cooperativeId) {
        await prisma.cooperative.update({
          where: { id: member.cooperativeId },
          data: {
            totalMembers: {
              decrement: 1,
            },
          },
        });
      }

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: req.user.id,
          cooperativeId: req.user.cooperativeId,
          action: 'MEMBER_REMOVED',
          entity: 'USER',
          entityId: id,
        },
      });

      res.json({ message: 'Member removed successfully' });
    } catch (error: any) {
      console.error('Remove member error:', error);
      res.status(500).json({ error: 'Failed to remove member' });
    }
  }

  static async getMemberFinancials(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const member = await prisma.user.findUnique({
        where: { id },
      });

      if (!member) {
        res.status(404).json({ error: 'Member not found' });
        return;
      }

      // Check authorization
      if (req.user.id !== id && 
          req.user.cooperativeId !== member.cooperativeId &&
          req.user.role !== 'SUPER_ADMIN') {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      let financialData = await prisma.memberFinancial.findUnique({
        where: { memberId: id },
      });

      // Create financial record if doesn't exist
      if (!financialData && member.cooperativeId) {
        financialData = await prisma.memberFinancial.create({
          data: {
            memberId: id,
            cooperativeId: member.cooperativeId,
          },
        });
      }

      // Get recent transactions
      const transactions = await prisma.transaction.findMany({
        where: { userId: id },
        take: 20,
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        financialData,
        transactions,
      });
    } catch (error: any) {
      console.error('Get member financials error:', error);
      res.status(500).json({ error: 'Failed to fetch financial data' });
    }
  }

  static async getPendingInvitations(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user || !req.user.cooperativeId) {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      const invitations = await prisma.invitation.findMany({
        where: {
          cooperativeId: req.user.cooperativeId,
          usedAt: null,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({ invitations });
    } catch (error: any) {
      console.error('Get pending invitations error:', error);
      res.status(500).json({ error: 'Failed to fetch invitations' });
    }
  }

  static async cancelInvitation(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!req.user || !req.user.cooperativeId) {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      const invitation = await prisma.invitation.findUnique({
        where: { id },
      });

      if (!invitation) {
        res.status(404).json({ error: 'Invitation not found' });
        return;
      }

      if (invitation.cooperativeId !== req.user.cooperativeId) {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      await prisma.invitation.delete({
        where: { id },
      });

      res.json({ message: 'Invitation cancelled successfully' });
    } catch (error: any) {
      console.error('Cancel invitation error:', error);
      res.status(500).json({ error: 'Failed to cancel invitation' });
    }
  }
}