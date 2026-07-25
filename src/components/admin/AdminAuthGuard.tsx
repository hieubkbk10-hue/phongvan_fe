import React from 'react';
import { Navigate, useLocation } from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" search={{ redirect: location.pathname }} replace />;
  }

  return <>{children}</>;
};
