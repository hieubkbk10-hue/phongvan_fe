import { apiClient } from '@/lib/api-client';
import type { Order, OrderListParams, CreateOrderInput, CompleteOrderInput, CancelOrderInput } from '../types';

export const getOrders = async (params?: OrderListParams) => {
  const searchParts: string[] = [];
  if (params?.search) {
    searchParts.push(`code:${params.search}`);
  }
  if (params?.status !== undefined) {
    searchParts.push(`status:${params.status}`);
  }

  const queryParams: Record<string, any> = {
    page: params?.page || 1,
    limit: params?.limit || 15,
    include: 'items,customer',
  };

  if (searchParts.length > 0) {
    queryParams.search = searchParts.join(';');
  }

  const response = await apiClient.get<{
    data: Order[];
    meta?: { pagination?: { total: number; count: number; per_page: number; current_page: number; total_pages: number } };
  }>('/orders', {
    params: queryParams,
  });

  return response.data;
};

export const getOrderById = async (id: string) => {
  const response = await apiClient.get<{ data: Order }>(`/orders/${id}`, {
    params: { include: 'items,customer' },
  });
  return response.data.data;
};

export const createOrder = async (data: CreateOrderInput) => {
  const response = await apiClient.post<{ data: Order }>('/orders', data);
  return response.data.data;
};

export const completeOrder = async (id: string, data: CompleteOrderInput) => {
  const response = await apiClient.post<{ data: Order }>(`/orders/${id}/complete`, data);
  return response.data.data;
};

export const cancelOrder = async (id: string, data: CancelOrderInput) => {
  const response = await apiClient.post<{ data: Order }>(`/orders/${id}/cancel`, data);
  return response.data.data;
};

export const deleteOrder = async (id: string) => {
  const response = await apiClient.delete(`/orders/${id}`);
  return response.data;
};
