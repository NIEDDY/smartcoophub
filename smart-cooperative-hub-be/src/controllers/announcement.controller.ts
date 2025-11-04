import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { UploadService } from '../services/upload.service';

export class AnnouncementController {
  static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { title, content, type, isPublic, expiresAt } = req.body;
      const cooperativeId = req.user.cooperativeId;

      // Upload attachments if provided
      let attachments: string[] = [];
      if (req.files && Array.isArray(req.files)) {
        attachments = await UploadService.uploadMultipleImages(
          req.files as Express.Multer.File[],
          'announcements'
        );
      }

      const announcement = await prisma.announcement.create({
        data: {
          title,
          content,
          type,
          isPublic: isPublic || false,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
          attachments,
          cooperativeId,
          postedBy: req.user.id,
        },
      });

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: req.user.id,
          cooperativeId,
          action: 'ANNOUNCEMENT_CREATED',
          entity: 'ANNOUNCEMENT',
          entityId: announcement.id,
          details: { title, type, isPublic },
        },
      });

      res.status(201).json({
        message: 'Announcement created successfully',
        announcement,
      });
    } catch (error: any) {
      console.error('Create announcement error:', error);
      res.status(500).json({ error: 'Failed to create announcement' });
    }
  }

  static async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { type, cooperativeId, page = 1, limit = 20 } = req.query;

      const where: any = {};

      // Public announcements or user's cooperative announcements
      if (req.user && req.user.cooperativeId) {
        where.OR = [
          { isPublic: true },
          { cooperativeId: req.user.cooperativeId },
        ];
      } else {
        where.isPublic = true;
      }

      if (type) where.type = type;
      if (cooperativeId) where.cooperativeId = cooperativeId;

      // Filter out expired announcements
      where.OR = [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ];

      const skip = (Number(page) - 1) * Number(limit);

      const [announcements, total] = await Promise.all([
        prisma.announcement.findMany({
          where,
          skip,
          take: Number(limit),
          include: {
            cooperative: {
              select: {
                id: true,
                name: true,
                logo: true,
              },
            },
            _count: {
              select: {
                applications: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.announcement.count({ where }),
      ]);

      res.json({
        announcements,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error: any) {
      console.error('Get announcements error:', error);
      res.status(500).json({ error: 'Failed to fetch announcements' });
    }
  }

  static async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const announcement = await prisma.announcement.findUnique({
        where: { id },
        include: {
          cooperative: {
            select: {
              id: true,
              name: true,
              logo: true,
              email: true,
              phone: true,
            },
          },
          applications: {
            where: req.user?.cooperativeId 
              ? { announcementId: id }
              : undefined,
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!announcement) {
        res.status(404).json({ error: 'Announcement not found' });
        return;
      }

      // Check authorization for non-public announcements
      if (!announcement.isPublic && 
          req.user?.cooperativeId !== announcement.cooperativeId &&
          req.user?.role !== 'SUPER_ADMIN') {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      res.json({ announcement });
    } catch (error: any) {
      console.error('Get announcement error:', error);
      res.status(500).json({ error: 'Failed to fetch announcement' });
    }
  }

  static async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const existingAnnouncement = await prisma.announcement.findUnique({
        where: { id },
      });

      if (!existingAnnouncement) {
        res.status(404).json({ error: 'Announcement not found' });
        return;
      }

      if (existingAnnouncement.cooperativeId !== req.user.cooperativeId &&
          req.user.role !== 'SUPER_ADMIN') {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      // Upload new attachments if provided
      if (req.files && Array.isArray(req.files)) {
        const newAttachments = await UploadService.uploadMultipleImages(
          req.files as Express.Multer.File[],
          'announcements'
        );
        updateData.attachments = [...existingAnnouncement.attachments, ...newAttachments];
      }

      const announcement = await prisma.announcement.update({
        where: { id },
        data: updateData,
      });

      res.json({
        message: 'Announcement updated successfully',
        announcement,
      });
    } catch (error: any) {
      console.error('Update announcement error:', error);
      res.status(500).json({ error: 'Failed to update announcement' });
    }
  }

  static async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const announcement = await prisma.announcement.findUnique({
        where: { id },
      });

      if (!announcement) {
        res.status(404).json({ error: 'Announcement not found' });
        return;
      }

      if (announcement.cooperativeId !== req.user.cooperativeId &&
          req.user.role !== 'SUPER_ADMIN') {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      await prisma.announcement.delete({
        where: { id },
      });

      res.json({ message: 'Announcement deleted successfully' });
    } catch (error: any) {
      console.error('Delete announcement error:', error);
      res.status(500).json({})
    }
  }}