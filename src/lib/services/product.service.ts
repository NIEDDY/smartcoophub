// src/lib/services/product.service.ts

import { api, ApiSuccessResponse } from '../api';
import { Product, Order } from '../../types';

interface CreateProductRequest {
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  availableStock: number;
  quality?: string;
  location: string;
}

export const productService = {
  async getAll(params?: { category?: string; search?: string; cooperativeId?: string }): Promise<ApiSuccessResponse<Product[]>> {
    let url = '/products';
    if (params) {
      const queryParams = new URLSearchParams();
      if (params.category) queryParams.append('category', params.category);
      if (params.search) queryParams.append('search', params.search);
      if (params.cooperativeId) queryParams.append('cooperativeId', params.cooperativeId);
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }
    return api.get(url);
  },

  async getCategories(): Promise<ApiSuccessResponse<string[]>> {
    return api.get('/products/categories');
  },

  async getById(id: string): Promise<ApiSuccessResponse<Product>> {
    return api.get(`/products/${id}`);
  },

  async create(data: CreateProductRequest, images?: File[]): Promise<ApiSuccessResponse<{ message: string }>> {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    if (images) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }

    return api.postFormData('/products', formData);
  },

  async update(id: string, data: Partial<CreateProductRequest>, images?: File[]): Promise<ApiSuccessResponse<{ message: string }>> {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    if (images) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }

    return api.putFormData(`/products/${id}`, formData);
  },

  async delete(id: string): Promise<ApiSuccessResponse<{ message: string }>> {
    return api.delete(`/products/${id}`);
  },

  async updateStock(id: string, availableStock: number): Promise<ApiSuccessResponse<{ message: string }>> {
    return api.patch(`/products/${id}/stock`, { availableStock });
  },
};

export const orderService = {
  async getAll(params?: { status?: string; cooperativeId?: string }): Promise<ApiSuccessResponse<Order[]>> {
    let url = '/orders';
    if (params) {
      const queryParams = new URLSearchParams();
      if (params.status) queryParams.append('status', params.status);
      if (params.cooperativeId) queryParams.append('cooperativeId', params.cooperativeId);
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }
    return api.get(url);
  },

  async getById(id: string): Promise<ApiSuccessResponse<Order>> {
    return api.get(`/orders/${id}`);
  },

  async create(data: { productId: string; quantity: number; deliveryAddress: string }): Promise<ApiSuccessResponse<{ message: string; orderId: string }>> {
    return api.post('/orders', data);
  },

  async updateStatus(id: string, status: string): Promise<ApiSuccessResponse<{ message: string }>> {
    return api.put(`/orders/${id}`, { status });
  },

  async cancel(id: string): Promise<ApiSuccessResponse<{ message: string }>> {
    return api.post(`/orders/${id}/cancel`);
  },
};
