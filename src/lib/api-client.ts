import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { toast } from '@/stores/useToastStore';
import type { ApiResponse } from '@/types';

export const apiClient = axios.create({
  baseURL: env.API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// LOGIC: Tự động gắn Bearer Token vào header nếu người dùng đã đăng nhập
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// LOGIC: Xử lý tập trung các phản hồi lỗi HTTP 401 Unauthenticated mà không sử dụng kiểu `any`
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const responseData = error.response?.data as ApiResponse | undefined;
    const msg = responseData?.message || error.message;

    // QUYỀN: Xóa token và điều hướng về trang Login khi phiên làm việc bị từ chối
    if (status === 401 || msg === 'Unauthenticated.') {
      useAuthStore.getState().logout();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth/login')) {
        window.location.href = '/auth/login';
      }
    } else if (status && status >= 500) {
      toast.error('Lỗi máy chủ: ' + (msg || 'Đã có lỗi hệ thống xảy ra'), 'Lỗi hệ thống');
    }

    return Promise.reject(error);
  }
);
