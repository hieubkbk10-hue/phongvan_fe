import { apiClient } from '@/lib/api-client';
import type { Product, ProductListParams, CreateProductInput, UpdateProductInput, MediaItem } from '../types';

export const getProducts = async (params?: ProductListParams) => {
  const response = await apiClient.get<{ data: Product[]; meta?: { pagination?: { total: number; count: number; per_page: number; current_page: number; total_pages: number } } }>('/products', {
    params: {
      page: params?.page || 1,
      limit: params?.limit || 15,
      ...(params?.search ? { search: params.search } : {}),
      ...(params?.status !== undefined ? { status: params.status } : {}),
      include: 'media',
    },
  });
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await apiClient.get<{ data: Product }>(`/products/${id}`, {
    params: { include: 'media' },
  });
  return response.data.data;
};

export const createProduct = async (data: CreateProductInput) => {
  const response = await apiClient.post<{ data: Product }>('/products', data);
  return response.data.data;
};

export const updateProduct = async ({ id, ...data }: UpdateProductInput) => {
  const response = await apiClient.patch<{ data: Product }>(`/products/${id}`, data);
  return response.data.data;
};

export const deleteProduct = async (id: string) => {
  const response = await apiClient.delete(`/products/${id}`);
  return response.data;
};

// Media API
export const uploadProductMedia = async (productId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post<{ data: MediaItem }>(`/products/${productId}/media`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};

export const deleteProductMedia = async (productId: string, mediaId: string) => {
  const response = await apiClient.delete(`/products/${productId}/media/${mediaId}`);
  return response.data;
};

export const setMainProductMedia = async (productId: string, mediaId: string) => {
  const response = await apiClient.patch<{ data: MediaItem }>(`/products/${productId}/media/${mediaId}/main`);
  return response.data.data;
};
