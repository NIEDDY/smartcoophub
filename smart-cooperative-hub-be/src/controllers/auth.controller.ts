import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import prisma from '../config/database';
import { config } from '../config';
import { OTPService } from '../services/otp.service';
import { EmailService } from '../services/email.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { UserRole, OTPType } from '../lib/enums';

export class AuthController {
  static async register(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, password, firstName, lastName, phone, role = 'BUYER' } = req.body;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        res.status(400).json({ error: 'User already exists' });
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      let user;
      // Always send OTP regardless of environment
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phone,
          role,
        },
      });
      try {
        await OTPService.createAndSendOTP(user.id, email, OTPType.REGISTRATION);
        res.status(201).json({
          message: 'Registration successful. OTP sent to your email.',
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Still create user but mark as inactive until email is verified
        await prisma.user.update({
          where: { id: user.id },
          data: { isActive: false },
        });
        res.status(201).json({
          message: 'Registration successful. Please contact support to verify your email.',
        });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  static async verifyEmail(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, code } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const isValid = await OTPService.verifyOTP(user.id, code, OTPType.REGISTRATION);

      if (!isValid) {
        res.status(400).json({ error: 'Invalid or expired OTP' });
        return;
      }

      // Activate user and mark email as verified
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isActive: true,
          emailVerified: true,
        },
      });

      // Send welcome email
      await EmailService.sendWelcomeEmail(user.email, user.firstName);

      // Generate token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          cooperativeId: user.cooperativeId,
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn } as SignOptions
      );

      res.json({
        message: 'Email verified successfully',
        token,
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
      console.error('Email verification error:', error);
      res.status(500).json({ error: 'Verification failed' });
    }
  }

  static async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          cooperative: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
        },
      });

      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      if (!user.isActive) {
        res.status(403).json({ error: 'Account is not active. Please verify your email.' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      // Generate token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          cooperativeId: user.cooperativeId,
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn } as SignOptions
      );

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: user.id,
          cooperativeId: user.cooperativeId,
          action: 'LOGIN',
          entity: 'USER',
          entityId: user.id,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
        },
      });

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          avatar: user.avatar,
          cooperative: user.cooperative,
        },
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }

  static async requestPasswordReset(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // Don't reveal if user exists
        res.json({ message: 'If the email exists, a password reset code has been sent.' });
        return;
      }

      // Generate and send OTP
      await OTPService.createAndSendOTP(user.id, email, OTPType.PASSWORD_RESET);

      res.json({ message: 'Password reset code sent to your email.' });
    } catch (error: any) {
      console.error('Password reset request error:', error);
      res.status(500).json({ error: 'Failed to send reset code' });
    }
  }

  static async resetPassword(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, code, newPassword } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const isValid = await OTPService.verifyOTP(user.id, code, OTPType.PASSWORD_RESET);

      if (!isValid) {
        res.status(400).json({ error: 'Invalid or expired OTP' });
        return;
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: user.id,
          cooperativeId: user.cooperativeId,
          action: 'PASSWORD_RESET',
          entity: 'USER',
          entityId: user.id,
        },
      });

      res.json({ message: 'Password reset successful' });
    } catch (error: any) {
      console.error('Password reset error:', error);
      res.status(500).json({ error: 'Password reset failed' });
    }
  }

  static async resendOTP(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, type = 'REGISTRATION' } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      await OTPService.createAndSendOTP(user.id, email, type);

      res.json({ message: 'OTP sent successfully' });
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      res.status(500).json({ error: 'Failed to resend OTP' });
    }
  }

  static async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          avatar: true,
          isActive: true,
          emailVerified: true,
          cooperativeId: true,
          cooperative: {
            select: {
              id: true,
              name: true,
              logo: true,
              status: true,
            },
          },
          createdAt: true,
        },
      });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({ user });
    } catch (error: any) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }

  static async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { firstName, lastName, phone } = req.body;

      const user = await prisma.user.update({
        where: { id: req.user.id },
        data: {
          firstName,
          lastName,
          phone,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          avatar: true,
        },
      });

      res.json({ message: 'Profile updated successfully', user });
    } catch (error: any) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
}