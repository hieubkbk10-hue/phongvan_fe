import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

// LOGIC: Cấu hình mặc định cho React Query Client không dùng any
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 phút
      gcTime: 1000 * 60 * 15, // 15 phút
      retry: (failureCount, error: unknown) => {
        // LOGIC: Không thử lại các câu query bị lỗi 404 Not Found hoặc 401 Unauthorized
        if (error instanceof AxiosError) {
          const status = error.response?.status;
          if (status === 404 || status === 401) return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
