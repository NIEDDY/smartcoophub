import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import prisma from '../config/database';
import { UserRole } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    cooperativeId?: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const decoded = jwt.verify(token, config.jwt.secret) as {
      id: string;
      email: string;
      role: UserRole;
      cooperativeId?: string;
    };

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        cooperativeId: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      res.status(401).json({ error: 'Invalid token or user inactive' });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      cooperativeId: user.cooperativeId || undefined,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
};

export const authorizeCooperative = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const cooperativeId = req.params.cooperativeId || req.body.cooperativeId;

    if (!cooperativeId) {
      res.status(400).json({ error: 'Cooperative ID required' });
      return;
    }

    // Super Admin can access all cooperatives
    if (req.user.role === 'SUPER_ADMIN') {
      next();
      return;
    }

    // RCA Regulator can view all cooperatives (read-only)
    if (req.user.role === 'RCA_REGULATOR') {
      next();
      return;
    }

    // Check if user belongs to the cooperative
    if (req.user.cooperativeId !== cooperativeId) {
      res.status(403).json({ error: 'Access denied to this cooperative' });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Authorization check failed' });
  }
};