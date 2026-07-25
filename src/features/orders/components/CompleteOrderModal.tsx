import React from 'react';
import { useForm } from 'react-hook-form';
import { X, CheckCircle2, Loader2 } from 'lucide-react';
import type { Order, CompleteOrderInput } from '@/types';

interface CompleteOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: CompleteOrderInput) => void;
  order: Order | null;
  isLoading?: boolean;
}

// UI: CompleteOrderModal hiển thị hộp thoại chuyển đơn sang Hoàn thành với Z-Index cố định z-[10000] theo chuẩn 3.3
export const CompleteOrderModal: React.FC<CompleteOrderModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  order,
  isLoading = false,
}) => {
  const { register, handleSubmit } = useForm<{
    delivery_date?: string;
    shipping_carrier?: string;
  }>();

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={22} />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Xác nhận Hoàn thành đơn hàng
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit((data) =>
            onConfirm({
              id: order.id,
              delivery_date: data.delivery_date || undefined,
              shipping_carrier: data.shipping_carrier || undefined,
            })
          )}
          className="p-6 space-y-4"
        >
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Chuyển đơn hàng{' '}
            <span className="font-bold font-mono text-slate-900 dark:text-slate-100">
              {order.code}
            </span>{' '}
            sang trạng thái Hoàn thành:
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Ngày giao hàng (YYYY-MM-DD)
            </label>
            <input
              type="date"
              {...register('delivery_date')}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Đơn vị vận chuyển
            </label>
            <input
              type="text"
              placeholder="VD: Giao Hàng Nhanh, Viettel Post..."
              {...register('shipping_carrier')}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-emerald-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-md transition-all flex items-center gap-2"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              <span>Hoàn thành đơn</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
