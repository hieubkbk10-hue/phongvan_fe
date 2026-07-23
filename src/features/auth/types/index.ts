import { z } from 'zod';
import type { User } from '@/types';

export const loginSchema = z.object({
  email: z.string().email('Standard email address required'),
  password: z.string().min(6, 'Password must contain at least 6 characters'),
  remember: z.boolean().optional(),
});

export type LoginPayload = z.infer<typeof loginSchema>;

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}
