import { apiClient } from '@/lib/api-client';
import type { Customer, CustomerListParams, CreateCustomerInput, UpdateCustomerInput } from '../types';

export const getCustomers = async (params?: CustomerListParams) => {
  const response = await apiClient.get<{
    data: Customer[];
    meta?: { pagination?: { total: number; count: number; per_page: number; current_page: number; total_pages: number } };
  }>('/v1/customers', {
    params: {
      page: params?.page || 1,
      limit: params?.limit || 15,
      ...(params?.search ? { search: params.search } : {}),
      ...(params?.trashed ? { trashed: params.trashed } : {}),
    },
  });
  return response.data;
};

export const getCustomerById = async (id: string) => {
  const response = await apiClient.get<{ data: Customer }>(`/v1/customers/${id}`);
  return response.data.data;
};

export const createCustomer = async (data: CreateCustomerInput) => {
  const response = await apiClient.post<{ data: Customer }>('/v1/customers', data);
  return response.data.data;
};

export const updateCustomer = async ({ id, ...data }: UpdateCustomerInput) => {
  const response = await apiClient.patch<{ data: Customer }>(`/v1/customers/${id}`, data);
  return response.data.data;
};

export const deleteCustomer = async (id: string) => {
  const response = await apiClient.delete(`/v1/customers/${id}`);
  return response.data;
};

export const restoreCustomer = async (id: string) => {
  const response = await apiClient.post<{ data: Customer }>(`/v1/customers/${id}/restore`);
  return response.data.data;
};
