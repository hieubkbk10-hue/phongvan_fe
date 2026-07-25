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
  const response = await apiClient.post<{ data: Customer }>('/customers', data);
  return response.data.data;
};

export const updateCustomer = async ({ id, ...data }: UpdateCustomerInput) => {
  const response = await apiClient.patch<{ data: Customer }>(`/customers/${id}`, data);
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
