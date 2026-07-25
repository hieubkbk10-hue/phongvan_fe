import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { AxiosError } from 'axios';

import { loginSchema } from '@/types';
import type { LoginPayload, ApiResponse } from '@/types';
import { useLogin } from '../api/useLogin';
import { Input, Button } from '@/components/ui';

interface LoginFormProps {
  onSuccess?: () => void;
}

// LOGIC: Component LoginForm xử lý đăng nhập hệ thống với validation Zod không dùng any
export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { mutate: login, isPending, error: apiError } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginPayload) => {
    login(data, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  const getErrorMessage = () => {
    if (!apiError) return null;
    if (apiError instanceof AxiosError) {
      const responseData = apiError.response?.data as ApiResponse | undefined;
      return (
        responseData?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.'
      );
    }
    return 'Đăng nhập thất bại. Vui lòng thử lại.';
  };

  const errorMessage = getErrorMessage();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-rose-600 dark:text-rose-400 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <Input
        label="Địa chỉ Email"
        type="email"
        placeholder="admin@example.com"
        leftIcon={<Mail className="w-4 h-4" />}
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Mật khẩu"
        type="password"
        placeholder="••••••••"
        leftIcon={<Lock className="w-4 h-4" />}
        error={errors.password?.message}
        {...register('password')}
      />

      <Button
        type="submit"
        className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md transition-all flex items-center justify-center gap-2"
        disabled={isPending}
      >
        <span>{isPending ? 'Đang xử lý...' : 'Đăng nhập CMS'}</span>
        <LogIn className="w-4 h-4" />
      </Button>
    </form>
  );
};
