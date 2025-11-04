// src/routes/cooperative.routes.ts

import { Router } from 'express';
import { CooperativeController } from '../controllers/cooperative.controller';
import { authenticate, authorize, authorizeCooperative } from '../middleware/auth.middleware';
// CRITICAL: Make sure you are importing from the CORRECT file, not the one with the typo.
import { validate, schemas } from '../middleware/validation.middleware';
import multer from 'multer';

const router = Router();
// Use multer's memory storage. This is simple and effective.
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /cooperatives:
 *   get:
 *     tags: [Cooperatives]
 *     summary: Get all cooperatives
 *     responses:
 *       200:
 *         description: List of cooperatives retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cooperative'
 */
router.get('/', CooperativeController.getAll);

/**
 * @swagger
 * /cooperatives/{id}:
 *   get:
 *     tags: [Cooperatives]
 *     summary: Get cooperative by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Cooperative ID
 *     responses:
 *       200:
 *         description: Cooperative retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Cooperative'
 *       404:
 *         description: Cooperative not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', CooperativeController.getById);

/**
 * @swagger
 * /cooperatives:
 *   post:
 *     tags: [Cooperatives]
 *     summary: Create a new cooperative
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *               registrationNumber:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               district:
 *                 type: string
 *               sector:
 *                 type: string
 *               cell:
 *                 type: string
 *               village:
 *                 type: string
 *               type:
 *                 type: string
 *               description:
 *                 type: string
 *               foundedDate:
 *                 type: string
 *                 format: date
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Logo image file
 *               certificate:
 *                 type: string
 *                 format: binary
 *                 description: Certificate file
 *               constitution:
 *                 type: string
 *                 format: binary
 *                 description: Constitution file
 *     responses:
 *       201:
 *         description: Cooperative created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/',
  authenticate,
  authorize('COOP_ADMIN', 'SUPER_ADMIN'),
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'certificate', maxCount: 1 },
    { name: 'constitution', maxCount: 1 },
  ]),
  validate(schemas.createCooperative),
  CooperativeController.create
);

/**
 * @swagger
 * /cooperatives/{id}:
 *   put:
 *     tags: [Cooperatives]
 *     summary: Update cooperative
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Cooperative ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *               registrationNumber:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               district:
 *                 type: string
 *               sector:
 *                 type: string
 *               cell:
 *                 type: string
 *               village:
 *                 type: string
 *               type:
 *                 type: string
 *               description:
 *                 type: string
 *               foundedDate:
 *                 type: string
 *                 format: date
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Logo image file
 *               certificate:
 *                 type: string
 *                 format: binary
 *                 description: Certificate file
 *               constitution:
 *                 type: string
 *                 format: binary
 *                 description: Constitution file
 *     responses:
 *       200:
 *         description: Cooperative updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Cooperative not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
  '/:id',
  authenticate,
  authorizeCooperative,
  authorize('COOP_ADMIN', 'SUPER_ADMIN'),
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'certificate', maxCount: 1 },
    { name: 'constitution', maxCount: 1 },
  ]),
  validate(schemas.updateCooperative),
  CooperativeController.update
);

/**
 * @swagger
 * /cooperatives/{id}/approve:
 *   post:
 *     tags: [Cooperatives]
 *     summary: Approve cooperative
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Cooperative ID
 *     responses:
 *       200:
 *         description: Cooperative approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Cooperative not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/:id/approve',
  authenticate,
  authorize('SUPER_ADMIN'),
  CooperativeController.approve
);

/**
 * @swagger
 * /cooperatives/{id}/reject:
 *   post:
 *     tags: [Cooperatives]
 *     summary: Reject cooperative
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Cooperative ID
 *     responses:
 *       200:
 *         description: Cooperative rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Cooperative not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/:id/reject',
  authenticate,
  authorize('SUPER_ADMIN'),
  CooperativeController.reject
);

/**
 * @swagger
 * /cooperatives/{id}/suspend:
 *   post:
 *     tags: [Cooperatives]
 *     summary: Suspend cooperative
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Cooperative ID
 *     responses:
 *       200:
 *         description: Cooperative suspended successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Cooperative not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/:id/suspend',
  authenticate,
  authorize('SUPER_ADMIN'),
  CooperativeController.suspend
);

/**
 * @swagger
 * /cooperatives/{cooperativeId}/dashboard:
 *   get:
 *     tags: [Cooperatives]
 *     summary: Get cooperative dashboard
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cooperativeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Cooperative ID
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalMembers:
 *                       type: integer
 *                     totalProducts:
 *                       type: integer
 *                     totalOrders:
 *                       type: integer
 *                     totalRevenue:
 *                       type: number
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/:cooperativeId/dashboard',
  authenticate,
  authorizeCooperative,
  CooperativeController.getDashboard
);

export default router;
