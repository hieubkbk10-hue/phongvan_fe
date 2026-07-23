import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '../stores/useAuthStore';
import type { User, ApiResponse } from '@/types';

export const getUserApi = async (): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>('/auth/me');
  return response.data.data;
};

export const useUser = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const updateUser = useAuthStore((state) => state.updateUser);

  return useQuery({
    queryKey: ['authenticated-user'],
    queryFn: async () => {
      const user = await getUserApi();
      updateUser(user);
      return user;
    },
    enabled: isAuthenticated,
  });
};
