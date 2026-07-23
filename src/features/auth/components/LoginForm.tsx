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
        <div className="p-3 rounded bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-rose-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            {(apiError as any)?.response?.data?.message || 'Authentication failed. Please check credentials.'}
          </span>
        </div>
      )}

      <Input
        label="Email Address"
        type="email"
        placeholder="user@example.com"
        leftIcon={<Mail className="w-4 h-4" />}
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        leftIcon={<Lock className="w-4 h-4" />}
        error={errors.password?.message}
        {...register('password')}
      />

      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-2 cursor-pointer text-slate-300">
          <input
            type="checkbox"
            className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500/30"
            {...register('remember')}
          />
          <span>Remember me</span>
        </label>
        <a href="#" className="text-indigo-400 hover:text-indigo-300 font-medium">
          Forgot password?
        </a>
      </div>

      <Button
        type="submit"
        className="w-full mt-2"
        isLoading={isPending}
        rightIcon={<LogIn className="w-4 h-4" />}
      >
        Sign In
      </Button>
    </form>
  );
};
