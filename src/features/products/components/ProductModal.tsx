import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Loader2 } from 'lucide-react';
import type { Product, CreateProductInput } from '@/types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProductInput) => void;
  product?: Product | null;
  isLoading?: boolean;
}

// UI: ProductModal hiển thị hộp thoại tạo/sửa sản phẩm với Z-Index cố định z-[10000] theo chuẩn 3.3
export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProductInput>({
    defaultValues: {
      name: '',
      price: 0,
      stock_quantity: 0,
      description: '',
      category: '',
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        price: Number(product.price),
        stock_quantity: Number(product.stock_quantity || 0),
        description: product.description || '',
        category: product.category || '',
      });
    } else {
      reset({
        name: '',
        price: 0,
        stock_quantity: 0,
        description: '',
        category: '',
      });
    }
  }, [product, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Tên sản phẩm <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="VD: Áo sơ mi nam cao cấp"
              {...register('name', { required: 'Tên sản phẩm không được để trống' })}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-blue-500"
            />
            {errors.name && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Giá niêm yết (VNĐ) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="1000"
              placeholder="VD: 250000"
              {...register('price', {
                required: 'Giá sản phẩm không được để trống',
                min: { value: 0, message: 'Giá không được âm' },
              })}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-blue-500"
            />
            {errors.price && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Số lượng tồn kho
            </label>
            <input
              type="number"
              placeholder="VD: 100"
              {...register('stock_quantity', { valueAsNumber: true })}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500"
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
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-md transition-all flex items-center gap-2"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              <span>{product ? 'Lưu thay đổi' : 'Thêm sản phẩm'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
