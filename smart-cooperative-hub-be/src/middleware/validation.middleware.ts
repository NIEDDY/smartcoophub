import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import {
  UserRole,
  TransactionType,
  PaymentMethod,
  AnnouncementType,
  RequestType,
} from '../lib/enums';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      res.status(400).json({
        error: 'Validation failed',
        details: errors,
      });
      return;
    }

    req.body = value;
    next();
  };
};

// Common validation schemas
export const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    phone: Joi.string().optional(),
    role: Joi.string().valid(...Object.values(UserRole)).optional(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  verifyOTP: Joi.object({
    email: Joi.string().email().required(),
    code: Joi.string().length(6).required(),
  }),

  resetPassword: Joi.object({
    email: Joi.string().email().required(),
    code: Joi.string().length(6).required(),
    newPassword: Joi.string().min(8).required(),
  }),

   createCooperative: Joi.object({
    name: Joi.string().min(3).required(),
    registrationNumber: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    district: Joi.string().required(),
    sector: Joi.string().required(),
    cell: Joi.string().required(),
    village: Joi.string().required(),
    type: Joi.string().required(),
    description: Joi.string().optional().allow(''), // .allow('') is good for optional text fields
    foundedDate: Joi.date().iso().optional(), // .iso() ensures a standard date format like "YYYY-MM-DD"
  }),

  updateCooperative: Joi.object({
    name: Joi.string().min(3).optional(),
    registrationNumber: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    address: Joi.string().optional(),
    district: Joi.string().optional(),
    sector: Joi.string().optional(),
    cell: Joi.string().optional(),
    village: Joi.string().optional(),
    type: Joi.string().optional(),
    description: Joi.string().optional().allow(''),
    foundedDate: Joi.date().iso().optional(),
  }),

  createProduct: Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.number().positive().required(),
    unit: Joi.string().required(),
    availableStock: Joi.number().min(0).required(),
    quality: Joi.string().optional(),
    location: Joi.string().optional(),
  }),

  createOrder: Joi.object({
    items: Joi.array().items(
      Joi.object({
        productId: Joi.string().uuid().required(),
        quantity: Joi.number().positive().required(),
      })
    ).min(1).required(),
    deliveryAddress: Joi.string().required(),
    paymentMethod: Joi.string().valid(...Object.values(PaymentMethod)).required(),
    notes: Joi.string().optional(),
  }),

  createTransaction: Joi.object({
    type: Joi.string().valid(...Object.values(TransactionType)).required(),
    amount: Joi.number().positive().required(),
    description: Joi.string().required(),
    category: Joi.string().optional(),
    reference: Joi.string().optional(),
    requiresApproval: Joi.boolean().optional(),
  }),

  createRequest: Joi.object({
    type: Joi.string().valid(...Object.values(RequestType)).required(),
    amount: Joi.number().positive().optional(),
    description: Joi.string().required(),
  }),

  createAnnouncement: Joi.object({
    title: Joi.string().min(5).required(),
    content: Joi.string().min(10).required(),
    type: Joi.string().valid(...Object.values(AnnouncementType)).required(),
    isPublic: Joi.boolean().optional(),
    expiresAt: Joi.date().optional(),
  }),

  inviteMember: Joi.object({
    email: Joi.string().email().required(),
    role: Joi.string().valid(...Object.values(UserRole)).required(),
  }),

  acceptInvitation: Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(8).required(),
    phone: Joi.string().optional(),
  }),
};
