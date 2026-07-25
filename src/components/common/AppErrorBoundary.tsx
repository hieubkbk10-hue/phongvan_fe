import React from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

// UI: Giao diện Fallback hiển thị khi gặp sự cố JavaScript không mong muốn
const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4 shadow-xl">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto text-xl font-bold">
          ⚠️
        </div>
        <h2 className="text-xl font-bold text-slate-100">Đã xảy ra sự cố giao diện</h2>
        <p className="text-xs text-slate-400">
          Ứng dụng gặp lỗi không mong muốn. Bạn có thể tải lại trang hoặc thử lại thao tác.
        </p>
        {error?.message && (
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-left text-xs font-mono text-rose-400 overflow-x-auto">
            {error.message}
          </div>
        )}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all"
          >
            Thử lại
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    </div>
  );
};

export interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

// LOGIC: AppErrorBoundary bọc các widget và màn hình chính để cô lập lỗi crash UI
export const AppErrorBoundary: React.FC<AppErrorBoundaryProps> = ({ children }) => {
  return <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>;
};
