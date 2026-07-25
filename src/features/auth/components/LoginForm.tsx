import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

import { loginSchema } from '../types';
import type { LoginPayload } from '../types';
import { useLogin } from '../api/useLogin';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface LoginFormProps {
  onSuccess?: () => void;
}

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
      remember: false,
    },
  });

  const onSubmit = (data: LoginPayload) => {
    login(data, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {apiError && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-rose-600 dark:text-rose-400 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            {(apiError as any)?.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.'}
          </span>
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

      <div className="flex items-center justify-between text-xs font-medium">
        <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
          <input
            type="checkbox"
            className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500/30"
            {...register('remember')}
          />
          <span>Ghi nhớ đăng nhập</span>
        </label>
        <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
          Quên mật khẩu?
        </a>
      </div>

      <Button
        type="submit"
        className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md transition-all"
        isLoading={isPending}
        rightIcon={<LogIn className="w-4 h-4" />}
      >
        Đăng nhập CMS
      </Button>
    </form>
  );
};
