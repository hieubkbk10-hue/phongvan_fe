import React, { useState, useEffect } from 'react';
import { X, Upload, Star, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import type { Product, MediaItem } from '../types';
import { getMediaList } from '../types';
import { uploadProductMedia, deleteProductMedia, setMainProductMedia } from '../api/productsApi';

interface ProductMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onMediaUpdated: () => void;
}

export const ProductMediaModal: React.FC<ProductMediaModalProps> = ({
  isOpen,
  onClose,
  product,
  onMediaUpdated,
}) => {
  const [localMedia, setLocalMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [actionMediaId, setActionMediaId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setLocalMedia(getMediaList(product.media));
    } else {
      setLocalMedia([]);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const canUpload = localMedia.length < 9;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (localMedia.length >= 9) {
      setErrorMsg('Mỗi sản phẩm chỉ được tối đa 9 ảnh.');
      return;
    }

    try {
      setUploading(true);
      setErrorMsg(null);
      const newMedia = await uploadProductMedia(product.id, file);
      if (newMedia) {
        setLocalMedia((prev) => [...prev, newMedia]);
      }
      onMediaUpdated();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Tải ảnh lên thất bại.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSetMain = async (mediaId: string) => {
    const previousMedia = [...localMedia];
    try {
      setActionMediaId(mediaId);
      setLocalMedia((prev) =>
        prev.map((m) => ({ ...m, is_main: m.id === mediaId }))
      );
      await setMainProductMedia(product.id, mediaId);
      onMediaUpdated();
    } catch (err: any) {
      setLocalMedia(previousMedia);
      setErrorMsg(err?.response?.data?.message || 'Không thể đặt ảnh chính.');
    } finally {
      setActionMediaId(null);
    }
  };

  const handleDelete = async (mediaId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa ảnh này?')) return;
    const previousMedia = [...localMedia];
    try {
      setActionMediaId(mediaId);
      setLocalMedia((prev) => prev.filter((m) => m.id !== mediaId));
      await deleteProductMedia(product.id, mediaId);
      onMediaUpdated();
    } catch (err: any) {
      setLocalMedia(previousMedia);
      setErrorMsg(err?.response?.data?.message || 'Không thể xóa ảnh.');
    } finally {
      setActionMediaId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Thư viện ảnh sản phẩm
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {product.name} ({localMedia.length}/9 ảnh)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400">
              {errorMsg}
            </div>
          )}

          {/* Upload Area */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <ImageIcon size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Tải ảnh mới</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Hỗ trợ PNG, JPG, WEBP (Tối đa 9 ảnh)</p>
              </div>
            </div>

            <label
              className={`px-4 py-2 text-sm font-medium rounded-lg shadow-xs flex items-center gap-2 cursor-pointer transition-all ${
                canUpload && !uploading
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              <span>{uploading ? 'Đang tải...' : 'Chọn file'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={!canUpload || uploading}
                className="hidden"
              />
            </label>
          </div>

          {/* Image Grid */}
          {localMedia.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <ImageIcon size={48} className="mx-auto opacity-30 mb-2" />
              <p className="text-sm font-medium">Sản phẩm chưa có hình ảnh nào.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              {localMedia.map((item) => (
                <div
                  key={item.id}
                  className={`group relative rounded-xl overflow-hidden border bg-slate-100 dark:bg-slate-800 transition-all ${
                    item.is_main
                      ? 'border-amber-500 ring-2 ring-amber-500/20'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <img
                    src={item.url}
                    alt="Product media"
                    className="w-full h-36 object-cover"
                  />

                  {/* Badges */}
                  {item.is_main && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-white font-bold text-[10px] uppercase rounded-md shadow-xs flex items-center gap-1">
                      <Star size={10} fill="currentColor" /> Ảnh chính
                    </span>
                  )}

                  {/* Hover Overlay Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    {!item.is_main && (
                      <button
                        onClick={() => handleSetMain(item.id)}
                        disabled={actionMediaId === item.id}
                        className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                        title="Đặt làm ảnh chính"
                      >
                        {actionMediaId === item.id ? <Loader2 size={16} className="animate-spin" /> : <Star size={16} />}
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={actionMediaId === item.id}
                      className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors"
                      title="Xóa ảnh"
                    >
                      {actionMediaId === item.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
