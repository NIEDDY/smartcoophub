// src/controllers/webhook.controller.ts
import { Request, Response } from 'express';
import prisma from '../config/database';
import { paypackService } from '../services/paypack.service';

export class WebhookController {
  static async handlePaypackWebhook(req: Request, res: Response): Promise<void> {
    const io = (req as any).io;
    const paymentSockets = (req as any).paymentSockets;
    const signature = req.get('x-paypack-signature');
    const rawBody = (req as any).rawBody;

    try {
      // 1. SECURITY: Verify the signature is from Paypack
      paypackService.verifyWebhookSignature(signature, rawBody);

      const { data } = req.body;
      if (!data || !data.ref) {
        console.warn('Webhook received with missing data or ref.');
        res.status(400).send('Invalid webhook payload.');
        return; 
      }

      console.log('Paypack webhook received for ref:', data.ref);

      // 2. FIND the order using the unique transaction reference
      const order = await prisma.order.findUnique({
        where: { transactionRef: data.ref },
      });

      if (!order) {
        console.warn(`Order with ref ${data.ref} not found.`);
        // Respond 200 OK so Paypack doesn't retry for a transaction we don't know.
        res.status(200).send('Order not found, but acknowledged.');
        return; 
      }

      // 3. UPDATE the order status based on the webhook event
      const newStatus = data.status === 'successful' ? 'COMPLETED' : 'FAILED';
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: newStatus },
      });

      console.log(`Order ${order.id} payment status updated to ${newStatus}`);

      // 4. EMIT REAL-TIME UPDATE via WebSocket if available
      const socketId = paymentSockets.get(order.id);
      if (socketId && io) {
        io.to(socketId).emit('payment:update', {
          orderId: order.id,
          status: updatedOrder.paymentStatus,
        });
        console.log(`Sent WebSocket update for order ${order.id} to socket ${socketId}`);
        paymentSockets.delete(order.id); 
      }

      // 5. RESPOND to Paypack to acknowledge receipt
      res.status(200).send('Webhook processed successfully.');

    } catch (error: any) {
      console.error('Error processing Paypack webhook:', error.message);
      res.status(500).send('Error processing webhook.');
    }
  }
}