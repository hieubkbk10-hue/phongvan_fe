import { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Image as ImageIcon, Package, Star, Search, Loader2 } from 'lucide-react';
import { getProducts } from '@/features/products/api/productsApi';
import type { Product } from '@/features/products/types';

export const Route = createFileRoute('/admin/media')({
  component: MediaLibraryPage,
});

function MediaLibraryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadMedia = async () => {
      try {
        setLoading(true);
        const res = await getProducts({ limit: 50 });
        setProducts(res.data);
      } catch (err) {
        console.error('Lỗi tải media:', err);
      } finally {
        setLoading(false);
      }
    };
    loadMedia();
  }, []);

  const allMedia = products.flatMap((p) =>
    (p.media || []).map((m) => ({
      ...m,
      productName: p.name,
      productId: p.id,
    }))
  );

  const filteredMedia = allMedia.filter((m) =>
    m.productName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <ImageIcon className="text-indigo-600 dark:text-indigo-400" size={26} />
            <span>Thư viện Media Sản phẩm</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tổng hợp toàn bộ hình ảnh sản phẩm đã tải lên hệ thống ({allMedia.length} ảnh)
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm ảnh theo tên sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Loader2 size={32} className="animate-spin text-indigo-600" />
            <p className="text-sm font-medium">Đang tải thư viện media...</p>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <ImageIcon size={48} className="mx-auto opacity-30 mb-2" />
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300">Chưa có hình ảnh nào</p>
            <p className="text-xs text-slate-500 mt-1">Hãy upload hình ảnh trực tiếp trong mục Quản lý sản phẩm</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMedia.map((media) => (
              <div
                key={media.id}
                className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shadow-2xs transition-all hover:shadow-md"
              >
                <img
                  src={media.url}
                  alt={media.productName}
                  className="w-full h-40 object-cover"
                />

                {media.is_main && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-white font-bold text-[10px] uppercase rounded-md shadow-xs flex items-center gap-1">
                    <Star size={10} fill="currentColor" /> Chính
                  </span>
                )}

                <div className="p-2.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate flex items-center gap-1">
                    <Package size={12} className="text-slate-400 shrink-0" />
                    <span>{media.productName}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
