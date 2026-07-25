import React from 'react';
import { useForm } from 'react-hook-form';
import { X, XCircle, Loader2 } from 'lucide-react';
import type { Order, CancelOrderInput } from '../types';

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: CancelOrderInput) => void;
  order: Order | null;
  isLoading?: boolean;
}

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  order,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CancelOrderInput>();

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <XCircle size={22} />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Xác nhận Hủy đơn hàng
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
        <form onSubmit={handleSubmit(onConfirm)} className="p-6 space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Hủy đơn hàng <span className="font-bold font-mono text-slate-900 dark:text-slate-100">{order.code}</span>. Hành động này không thể hoàn tác. Vui lòng nhập lý do hủy:
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Lý do hủy đơn <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="VD: Khách thay đổi ý định, hết hàng kho..."
              {...register('cancel_reason', { required: 'Vui lòng nhập lý do hủy đơn' })}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-rose-500"
            />
            {errors.cancel_reason && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{errors.cancel_reason.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Quay lại
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg shadow-md transition-all flex items-center gap-2"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              <span>Hủy đơn hàng</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
