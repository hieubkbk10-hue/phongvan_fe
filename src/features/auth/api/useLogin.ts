import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '../stores/useAuthStore';
import type { LoginPayload, AuthResponse } from '../types';
import type { ApiResponse } from '@/types';

export const loginApi = async (credentials: LoginPayload): Promise<AuthResponse> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
  return response.data.data;
};

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
    },
  });
};
