import { apiClient } from '@/lib/api-client';
import type {
  Customer,
  CustomerListParams,
  CreateCustomerInput,
  UpdateCustomerInput,
} from '@/types';

// LOGIC: Lấy danh sách khách hàng từ API phân trang và lọc xóa mềm
export const getCustomers = async (params?: CustomerListParams) => {
  const queryParams: Record<string, string | number> = {
    page: params?.page || 1,
    limit: params?.limit || 15,
  };

  if (params?.trashed) {
    queryParams.trashed = params.trashed;
  }

  if (params?.search && params.search.trim() !== '') {
    const s = params.search.trim();
    if (/^\+?[0-9]+$/.test(s)) {
      queryParams.search = `phone:${s}`;
    } else if (s.includes('@')) {
      queryParams.search = `email:${s}`;
    } else {
      queryParams.search = `name:${s}`;
    }
  }

  const response = await apiClient.get<{
    data: Customer[];
    meta?: {
      pagination?: {
        total: number;
        count: number;
        per_page: number;
        current_page: number;
        total_pages: number;
      };
    };
  }>('/customers', {
    params: queryParams,
  });

  return response.data;
};

export const getCustomerById = async (id: string) => {
  const response = await apiClient.get<{ data: Customer }>(`/customers/${id}`);
  return response.data.data;
};

export const createCustomer = async (data: CreateCustomerInput) => {
  const payload: Record<string, unknown> = {
    name: data.name,
    phone: data.phone,
    address: data.address || '',
  };
  if (data.email) payload.email = data.email;

  const response = await apiClient.post<{ data: Customer }>('/customers', payload);
  return response.data.data;
};

export const updateCustomer = async ({ id, ...data }: UpdateCustomerInput) => {
  const payload: Record<string, unknown> = {};
  if (data.name !== undefined) payload.name = data.name;
  if (data.phone !== undefined) payload.phone = data.phone;
  if (data.address !== undefined) payload.address = data.address;
  if (data.email !== undefined) payload.email = data.email;

  const response = await apiClient.patch<{ data: Customer }>(`/customers/${id}`, payload);
  return response.data.data;
};

export const deleteCustomer = async (id: string) => {
  const response = await apiClient.delete(`/customers/${id}`);
  return response.data;
};

export const restoreCustomer = async (id: string) => {
  const response = await apiClient.post<{ data: Customer }>(`/customers/${id}/restore`);
  return response.data.data;
};
