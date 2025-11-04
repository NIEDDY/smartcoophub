// src/lib/services/auth.service.ts

import { api, ApiSuccessResponse } from '../api';
import { User } from '../../types';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: string;
}

interface VerifyEmailRequest {
  email: string;
  code: string; // OTP uses 'code' field
}

interface ResendOTPRequest {
  email: string;
  type?: string; // REGISTRATION or PASSWORD_RESET
}

interface ResetPasswordRequest {
  email: string;
  code: string; // OTP uses 'code' field
  newPassword: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    avatar?: string;
    cooperative?: any;
  };
  token: string;
}

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: string;
  cooperativeId?: string;
  isActive: boolean;
  emailVerified: boolean;
}

export const authService = {
  async register(data: RegisterRequest): Promise<ApiSuccessResponse<{ userId?: string; message: string }>> {
    return api.post('/auth/register', data);
  },

  async verifyEmail(data: VerifyEmailRequest): Promise<ApiSuccessResponse<{ user: UserProfile; token: string }>> {
    return api.post('/auth/verify-email', data);
  },

  async login(data: LoginRequest): Promise<ApiSuccessResponse<LoginResponse>> {
    return api.post('/auth/login', data);
  },

  async forgotPassword(email: string): Promise<ApiSuccessResponse<{ message: string }>> {
    return api.post('/auth/forgot-password', { email });
  },

  async resetPassword(data: ResetPasswordRequest): Promise<ApiSuccessResponse<{ message: string }>> {
    return api.post('/auth/reset-password', data);
  },

  async resendOTP(email: string, type?: string): Promise<ApiSuccessResponse<{ message: string }>> {
    return api.post('/auth/resend-otp', { email, type: type || 'REGISTRATION' });
  },

  async getProfile(): Promise<ApiSuccessResponse<UserProfile>> {
    return api.get('/auth/profile');
  },

  async updateProfile(data: Partial<UserProfile>): Promise<ApiSuccessResponse<{ message: string }>> {
    return api.put('/auth/profile', data);
  },
};
