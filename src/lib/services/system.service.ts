// src/lib/services/system.service.ts

import { api, ApiSuccessResponse } from '../api';

interface SystemStats {
  totalCooperatives: number;
  approvedCooperatives: number;
  pendingCooperatives: number;
  totalUsers: number;
  totalTransactions: number;
  totalOrders: number;
  totalRevenue: number;
  activeAnnouncements: number;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  cooperativeId?: string;
  isActive: boolean;
  createdAt: string;
}

interface Transaction {
  id: string;
  cooperativeId: string;
  userId?: string;
  type: string;
  amount: number;
  description: string;
  category?: string;
  reference?: string;
  isApproved: boolean;
  createdAt: string;
}

interface Announcement {
  id: string;
  cooperativeId?: string;
  title: string;
  content: string;
  type: string;
  isPublic: boolean;
  createdAt: string;
}

export const systemService = {
  // Get system-wide statistics
  async getStats(): Promise<ApiSuccessResponse<SystemStats>> {
    return api.get('/system/stats');
  },

  // Get all users in the system
  async getAllUsers(params?: { role?: string; limit?: number; offset?: number }): Promise<ApiSuccessResponse<User[]>> {
    let url = '/users';
    if (params) {
      const queryParams = new URLSearchParams();
      if (params.role) queryParams.append('role', params.role);
      if (params.limit) queryParams.append('limit', String(params.limit));
      if (params.offset) queryParams.append('offset', String(params.offset));
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }
    return api.get(url);
  },

  // Get all transactions in the system
  async getAllTransactions(params?: { type?: string; limit?: number; offset?: number }): Promise<ApiSuccessResponse<Transaction[]>> {
    let url = '/transactions';
    if (params) {
      const queryParams = new URLSearchParams();
      if (params.type) queryParams.append('type', params.type);
      if (params.limit) queryParams.append('limit', String(params.limit));
      if (params.offset) queryParams.append('offset', String(params.offset));
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }
    return api.get(url);
  },

  // Get all announcements
  async getAllAnnouncements(params?: { type?: string; isPublic?: boolean; limit?: number }): Promise<ApiSuccessResponse<Announcement[]>> {
    let url = '/announcements';
    if (params) {
      const queryParams = new URLSearchParams();
      if (params.type) queryParams.append('type', params.type);
      if (params.isPublic !== undefined) queryParams.append('isPublic', String(params.isPublic));
      if (params.limit) queryParams.append('limit', String(params.limit));
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }
    return api.get(url);
  },

  // Get dashboard data (all in one call)
  async getDashboardData(): Promise<ApiSuccessResponse<{
    stats: SystemStats;
    recentUsers: User[];
    recentTransactions: Transaction[];
    recentAnnouncements: Announcement[];
  }>> {
    return api.get('/system/dashboard');
  },
};
