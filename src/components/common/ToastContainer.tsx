import React from 'react';
import { useToastStore, type ToastItem } from '@/stores/useToastStore';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const toastStyles: Record<
  ToastItem['type'],
  { bg: string; border: string; icon: React.ReactNode; text: string }
> = {
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/80',
    border: 'border-emerald-200 dark:border-emerald-800',
    icon: <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />,
    text: 'text-emerald-900 dark:text-emerald-100',
  },
  error: {
    bg: 'bg-rose-50 dark:bg-rose-950/80',
    border: 'border-rose-200 dark:border-rose-800',
    icon: <AlertCircle size={18} className="text-rose-500 shrink-0" />,
    text: 'text-rose-900 dark:text-rose-100',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/80',
    border: 'border-amber-200 dark:border-amber-800',
    icon: <AlertTriangle size={18} className="text-amber-500 shrink-0" />,
    text: 'text-amber-900 dark:text-amber-100',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950/80',
    border: 'border-blue-200 dark:border-blue-800',
    icon: <Info size={18} className="text-blue-500 shrink-0" />,
    text: 'text-blue-900 dark:text-blue-100',
  },
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2.5 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => {
        const style = toastStyles[toast.type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 duration-200 ${style.bg} ${style.border}`}
          >
            {style.icon}
            <div className="flex-1 min-w-0">
              {toast.title && (
                <h4 className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${style.text}`}>
                  {toast.title}
                </h4>
              )}
              <p className={`text-sm ${style.text}`}>{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
