// src/lib/services/cooperative.service.ts

import { api, ApiSuccessResponse } from '../api';
import { Cooperative } from '../../types';

interface CreateCooperativeRequest {
  name: string;
  registrationNumber: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  type: string;
  description: string;
  foundedDate: string;
}

interface DashboardData {
  totalMembers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export const cooperativeService = {
  async getAll(): Promise<ApiSuccessResponse<Cooperative[]>> {
    return api.get('/cooperatives');
  },

  async getById(id: string): Promise<ApiSuccessResponse<Cooperative>> {
    return api.get(`/cooperatives/${id}`);
  },

  async create(data: CreateCooperativeRequest, files: { logo?: File; certificate?: File; constitution?: File }): Promise<ApiSuccessResponse<{ message: string }>> {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    Object.entries(files).forEach(([key, file]) => {
      if (file) {
        formData.append(key, file);
      }
    });

    return api.postFormData('/cooperatives', formData);
  },

  async update(id: string, data: Partial<CreateCooperativeRequest>, files: { logo?: File; certificate?: File; constitution?: File }): Promise<ApiSuccessResponse<{ message: string }>> {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });

    Object.entries(files).forEach(([key, file]) => {
      if (file) {
        formData.append(key, file);
      }
    });

    return api.putFormData(`/cooperatives/${id}`, formData);
  },

  async approve(id: string): Promise<ApiSuccessResponse<{ message: string }>> {
    return api.post(`/cooperatives/${id}/approve`);
  },

  async reject(id: string): Promise<ApiSuccessResponse<{ message: string }>> {
    return api.post(`/cooperatives/${id}/reject`);
  },

  async suspend(id: string): Promise<ApiSuccessResponse<{ message: string }>> {
    return api.post(`/cooperatives/${id}/suspend`);
  },

  async getDashboard(cooperativeId: string): Promise<ApiSuccessResponse<DashboardData>> {
    return api.get(`/cooperatives/${cooperativeId}/dashboard`);
  },
};
