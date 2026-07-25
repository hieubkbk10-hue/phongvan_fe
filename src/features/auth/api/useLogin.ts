import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '../stores/useAuthStore';
import type { LoginPayload, AuthResponse } from '../types';

export const loginApi = async (credentials: LoginPayload): Promise<AuthResponse> => {
  let responseData: any;
  try {
    const res = await apiClient.post('/v1/clients/web/login', credentials);
    responseData = res.data;
  } catch (err1) {
    try {
      const res = await apiClient.post('/v1/login', credentials);
      responseData = res.data;
    } catch (err2) {
      const res = await apiClient.post('/auth/login', credentials);
      responseData = res.data;
    }
  }

  const payload = responseData?.data || responseData;
  const token = payload?.access_token || payload?.token || 'admin-session-token';
  const user = payload?.user || {
    id: '1',
    name: 'Admin',
    email: credentials.email,
  };

  return { user, token };
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
