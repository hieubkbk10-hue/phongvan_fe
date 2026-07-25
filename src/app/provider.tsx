import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/query-client';
import { AppErrorBoundary } from '@/components/common/AppErrorBoundary';

interface AppProviderProps {
  children: React.ReactNode;
}

// LOGIC: AppProvider cung cấp React Query Client và cô lập lỗi toàn cục với AppErrorBoundary
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppErrorBoundary>
  );
};
