import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { paypackService } from '../services/paypack.service';

export class OrderController {

   static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { items, deliveryAddress, paymentMethod, notes } = req.body;
      let totalAmount = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        if (!product || !product.isActive) {
          res.status(400).json({ error: `Product ${item.productId} not found or inactive` });
          return;
        }
        if (product.availableStock < item.quantity) {
          res.status(400).json({ error: `Insufficient stock for ${product.name}. Available: ${product.availableStock}` });
          return;
        }
        const subtotal = product.price * item.quantity;
        totalAmount += subtotal;
        orderItems.push({ productId: product.id, quantity: item.quantity, price: product.price, subtotal });
      }

      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const order = await prisma.order.create({
        data: {
          orderNumber,
          buyerId: req.user.id,
          totalAmount,
          deliveryAddress,
          paymentMethod,
          notes,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          items: { create: orderItems },
        },
        include: { items: { include: { product: true } } },
      });

      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { availableStock: { decrement: item.quantity } },
        });
      }

      await prisma.activityLog.create({
        data: {
          userId: req.user.id,
          action: 'ORDER_CREATED',
          entity: 'ORDER',
          entityId: order.id,
          details: { orderNumber, totalAmount, itemCount: items.length },
        },
      });

      res.status(201).json({ message: 'Order created successfully', order });
    } catch (error: any) {
      console.error('Create order error:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  }

  static async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { status, page = 1, limit = 20 } = req.query;

      const where: any = {};

      // Buyers see only their orders
      if (req.user.role === 'BUYER') {
        where.buyerId = req.user.id;
      }
      // Cooperative members see orders for their products
      else if (req.user.cooperativeId) {
        where.items = {
          some: {
            product: {
              cooperativeId: req.user.cooperativeId,
            },
          },
        };
      }

      if (status) where.status = status;

      const skip = (Number(page) - 1) * Number(limit);

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          skip,
          take: Number(limit),
          include: {
            buyer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
            items: {
              include: {
                product: {
                  include: {
                    cooperative: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.order.count({ where }),
      ]);

      res.json({
        orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error: any) {
      console.error('Get orders error:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }

  static async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          buyer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          items: {
            include: {
              product: {
                include: {
                  cooperative: true,
                },
              },
            },
          },
        },
      });

      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      // Check authorization
      if (req.user?.id !== order.buyerId && 
          req.user?.role !== 'SUPER_ADMIN' &&
          !order.items.some((item: { product: { cooperativeId: string | undefined; }; }) => item.product.cooperativeId === req.user?.cooperativeId)) {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      res.json({ order });
    } catch (error: any) {
      console.error('Get order error:', error);
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  }

  static async updateStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!req.user || !req.user.cooperativeId) {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      // Check if user's cooperative has products in this order
      const hasProducts = order.items.some(
        (        item: { product: { cooperativeId: string | undefined; }; }) => item.product.cooperativeId === req.user?.cooperativeId
      );

      if (!hasProducts && req.user.role !== 'SUPER_ADMIN') {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      const updatedOrder = await prisma.order.update({
        where: { id },
        data: { status },
      });

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: req.user.id,
          cooperativeId: req.user.cooperativeId,
          action: 'ORDER_STATUS_UPDATED',
          entity: 'ORDER',
          entityId: id,
          details: { oldStatus: order.status, newStatus: status },
        },
      });

      res.json({
        message: 'Order status updated successfully',
        order: updatedOrder,
      });
    } catch (error: any) {
      console.error('Update order status error:', error);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  }

   static async processPayment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { phoneNumber } = req.body;

      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const order = await prisma.order.findUnique({ where: { id } });

      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      if (order.buyerId !== req.user.id) {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      if (order.paymentStatus === 'COMPLETED' || order.paymentStatus === 'PROCESSING') {
        res.status(400).json({ error: 'Payment already processed or is in progress' });
        return;
      }

      if (order.paymentMethod === 'PAYPACK') {
        // INITIATE the payment with Paypack
        const paymentResult = await paypackService.cashin({
          amount: order.totalAmount,
          number: phoneNumber,
        });

        // UPDATE the order with the reference and set status to PROCESSING
        await prisma.order.update({
          where: { id },
          data: {
            paymentStatus: 'PROCESSING',
            transactionRef: paymentResult.ref,
          },
        });

        // RESPOND to the user that the payment has been initiated
        res.json({
          message: 'Payment initiated. Please approve the transaction on your phone.',
          transactionRef: paymentResult.ref,
          orderId: order.id,
        });
      } else {
        res.status(400).json({ error: 'Payment method not supported for automatic processing' });
      }
    } catch (error: any) {
      console.error('Process payment error:', error);
      const errorMessage = error.details ? JSON.stringify(error.details) : error.message;
      res.status(error.statusCode || 500).json({ error: 'Failed to process payment', details: errorMessage });
    }
  }

  static async cancelOrder(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          items: true,
        },
      });

      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      if (order.buyerId !== req.user.id && req.user.role !== 'SUPER_ADMIN') {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      if (order.status === 'DELIVERED') {
        res.status(400).json({ error: 'Cannot cancel delivered order' });
        return;
      }

      // Restore product stock
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            availableStock: {
              increment: item.quantity,
            },
          },
        });
      }

      await prisma.order.update({
        where: { id },
        data: { status: 'CANCELLED' },
      });

      res.json({ message: 'Order cancelled successfully' });
    } catch (error: any) {
      console.error('Cancel order error:', error);
      res.status(500).json({ error: 'Failed to cancel order' });
    }
  }
}