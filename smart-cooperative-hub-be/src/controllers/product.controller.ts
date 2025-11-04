import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { UploadService } from '../services/upload.service';

export class ProductController {
  static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user || !req.user.cooperativeId) {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      const productData = req.body;
      const cooperativeId = req.user.cooperativeId;

      // Upload product images
      let images: string[] = [];
      if (req.files && Array.isArray(req.files)) {
        images = await UploadService.uploadMultipleImages(
          req.files as Express.Multer.File[],
          'products'
        );
      }

      const product = await prisma.product.create({
        data: {
          ...productData,
          cooperativeId,
          images,
        },
      });

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: req.user.id,
          cooperativeId,
          action: 'PRODUCT_CREATED',
          entity: 'PRODUCT',
          entityId: product.id,
        },
      });

      res.status(201).json({
        message: 'Product created successfully',
        product,
      });
    } catch (error: any) {
      console.error('Create product error:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  }

  static async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { category, cooperativeId, search, page = 1, limit = 20 } = req.query;

      const where: any = { isActive: true };
      
      if (category) where.category = category;
      if (cooperativeId) where.cooperativeId = cooperativeId;
      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      const skip = (Number(page) - 1) * Number(limit);

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: Number(limit),
          include: {
            cooperative: {
              select: {
                id: true,
                name: true,
                logo: true,
                district: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.product.count({ where }),
      ]);

      res.json({
        products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error: any) {
      console.error('Get products error:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  }

  static async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          cooperative: {
            select: {
              id: true,
              name: true,
              logo: true,
              email: true,
              phone: true,
              address: true,
              district: true,
            },
          },
        },
      });

      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      res.json({ product });
    } catch (error: any) {
      console.error('Get product error:', error);
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  }

  static async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!req.user || !req.user.cooperativeId) {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      // Check if product belongs to user's cooperative
      const existingProduct = await prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      if (existingProduct.cooperativeId !== req.user.cooperativeId) {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      // Upload new images if provided
      if (req.files && Array.isArray(req.files)) {
        const newImages = await UploadService.uploadMultipleImages(
          req.files as Express.Multer.File[],
          'products'
        );
        updateData.images = [...existingProduct.images, ...newImages];
      }

      const product = await prisma.product.update({
        where: { id },
        data: updateData,
      });

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: req.user.id,
          cooperativeId: req.user.cooperativeId,
          action: 'PRODUCT_UPDATED',
          entity: 'PRODUCT',
          entityId: id,
        },
      });

      res.json({ message: 'Product updated successfully', product });
    } catch (error: any) {
      console.error('Update product error:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  }

  static async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!req.user || !req.user.cooperativeId) {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      const product = await prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      if (product.cooperativeId !== req.user.cooperativeId) {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      // Soft delete - just deactivate
      await prisma.product.update({
        where: { id },
        data: { isActive: false },
      });

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: req.user.id,
          cooperativeId: req.user.cooperativeId,
          action: 'PRODUCT_DELETED',
          entity: 'PRODUCT',
          entityId: id,
        },
      });

      res.json({ message: 'Product deleted successfully' });
    } catch (error: any) {
      console.error('Delete product error:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  }

  static async updateStock(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { availableStock } = req.body;

      if (!req.user || !req.user.cooperativeId) {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      const product = await prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      if (product.cooperativeId !== req.user.cooperativeId) {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      const updatedProduct = await prisma.product.update({
        where: { id },
        data: { availableStock: Number(availableStock) },
      });

      res.json({
        message: 'Stock updated successfully',
        product: updatedProduct,
      });
    } catch (error: any) {
      console.error('Update stock error:', error);
      res.status(500).json({ error: 'Failed to update stock' });
    }
  }

  static async getCategories(req: AuthRequest, res: Response): Promise<void> {
    try {
      const categories = await prisma.product.findMany({
        where: { isActive: true },
        select: { category: true },
        distinct: ['category'],
      });

      const categoryList = categories.map((c: { category: any; }) => c.category);

      res.json({ categories: categoryList });
    } catch (error: any) {
      console.error('Get categories error:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  }
}