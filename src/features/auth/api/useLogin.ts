import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '../stores/useAuthStore';
import type { LoginPayload, AuthResponse } from '../types';

export const loginApi = async (credentials: LoginPayload): Promise<AuthResponse> => {
  // 1. Send credentials to Apiato Web Client Login Proxy (/v1/clients/web/login)
  const response = await apiClient.post('/clients/web/login', {
    email: credentials.email,
    password: credentials.password,
  });

  const payload = response.data?.data || response.data;
  const token = payload?.access_token || payload?.token;

  if (!token) {
    throw new Error('Access token not returned from server.');
  }

  // 2. Fetch authenticated profile from /v1/profile
  let user = {
    id: '1',
    name: credentials.email.split('@')[0],
    email: credentials.email,
  };

  try {
    const profileRes = await apiClient.get('/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const profileData = profileRes.data?.data || profileRes.data;
    if (profileData) {
      user = {
        id: profileData.id || '1',
        name: profileData.name || credentials.email.split('@')[0],
        email: profileData.email || credentials.email,
      };
    }
  } catch (err) {
    console.warn('Could not fetch user profile details:', err);
  }

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
