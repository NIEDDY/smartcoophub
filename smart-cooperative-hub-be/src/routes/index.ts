import { Router } from 'express';
import authRoutes from './auth.routes';
import cooperativeRoutes from './cooperative.routes';
import memberRoutes from './member.routes';
import productRoutes from './product.routes';
import webhookRoutes from './webhook.routes'; 
import orderRoutes from './order.routes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
router.use('/auth', authRoutes);
router.use('/cooperatives', cooperativeRoutes);
router.use('/members', memberRoutes);
router.use('/products', productRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/orders', orderRoutes); 



export default router;