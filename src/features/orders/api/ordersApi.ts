import { apiClient } from '@/lib/api-client';
import type { Order, OrderListParams, CreateOrderInput, CompleteOrderInput, CancelOrderInput } from '../types';

export const getOrders = async (params?: OrderListParams) => {
  const response = await apiClient.get<{
    data: Order[];
    meta?: { pagination?: { total: number; count: number; per_page: number; current_page: number; total_pages: number } };
  }>('/v1/orders', {
    params: {
      page: params?.page || 1,
      limit: params?.limit || 15,
      ...(params?.search ? { search: params.search } : {}),
      ...(params?.status !== undefined ? { status: params.status } : {}),
      include: 'items,customer',
    },
  });
  return response.data;
};

export const getOrderById = async (id: string) => {
  const response = await apiClient.get<{ data: Order }>(`/v1/orders/${id}`, {
    params: { include: 'items,customer' },
  });
  return response.data.data;
};

export const createOrder = async (data: CreateOrderInput) => {
  const response = await apiClient.post<{ data: Order }>('/v1/orders', data);
  return response.data.data;
};

export const completeOrder = async (id: string, data: CompleteOrderInput) => {
  const response = await apiClient.post<{ data: Order }>(`/v1/orders/${id}/complete`, data);
  return response.data.data;
};

export const cancelOrder = async (id: string, data: CancelOrderInput) => {
  const response = await apiClient.post<{ data: Order }>(`/v1/orders/${id}/cancel`, data);
  return response.data.data;
};

export const deleteOrder = async (id: string) => {
  const response = await apiClient.delete(`/v1/orders/${id}`);
  return response.data;
};
