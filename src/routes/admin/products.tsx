import { useState, useEffect, useCallback } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { AxiosError } from 'axios';
import type { Product, CreateProductInput, ApiResponse } from '@/types';
import { getMediaList } from '@/types';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/features/products/api/productsApi';
import { ProductModal } from '@/features/products/components/ProductModal';
import { ProductMediaModal } from '@/features/products/components/ProductMediaModal';
import { useRealtimeSync } from '@/features/real-time/hooks/useRealtimeSync';

export const Route = createFileRoute('/admin/products')({
  component: ProductsPage,
});

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  // UI: Quản lý các biến state boolean theo chuẩn is[Feature][State]
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [selectedMediaProduct, setSelectedMediaProduct] = useState<Product | null>(null);

  // LOGIC: Tải danh sách sản phẩm phân trang từ API
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getProducts({
        page,
        limit: 10,
        search: search || undefined,
        status: statusFilter,
      });

      let items = Array.isArray(result.data) ? result.data : [];
      if (statusFilter !== undefined) {
        items = items.filter((p) => Number(p.status) === Number(statusFilter));
      }

      setProducts(items);
      if (result.meta?.pagination) {
        setTotalPages(result.meta.pagination.total_pages);
      } else {
        setTotalPages(1);
      }
    } catch (error: unknown) {
      console.error('Lỗi tải danh sách sản phẩm:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // LOGIC: Soketi WebSocket listener tự động làm mới khi có sự kiện sản phẩm
  useRealtimeSync({
    channel: 'products',
    events: ['ProductCreated', 'ProductUpdated', 'ProductDeleted', 'ProductStatusUpdated'],
    onEvent: () => {
      fetchProducts();
    },
  });

  // LOGIC: Optimistic UI tạo mới hoặc cập nhật thông tin sản phẩm 0ms latency
  const handleCreateOrUpdate = async (data: CreateProductInput) => {
    const previousProducts = [...products];
    try {
      setIsSubmitting(true);
      if (editingProduct) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? { ...p, ...data } : p))
        );
        setIsModalOpen(false);
        const updated = await updateProduct({ id: editingProduct.id, ...data });
        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? updated : p)));
      } else {
        const tempId = 'temp-' + Date.now();
        const optimisticProd: Product = {
          id: tempId,
          name: data.name,
          price: data.price,
          status: data.status ?? 1,
          stock_quantity: 0,
          media: [],
        };
        setProducts((prev) => [optimisticProd, ...prev]);
        setIsModalOpen(false);
        const created = await createProduct(data);
        setProducts((prev) => prev.map((p) => (p.id === tempId ? created : p)));
      }
      setEditingProduct(null);
    } catch (error: unknown) {
      setProducts(previousProducts); // LOGIC: Rollback khi gặp lỗi API
      let message = 'Thao tác thất bại.';
      if (error instanceof AxiosError) {
        const res = error.response?.data as ApiResponse | undefined;
        if (res?.message) message = res.message;
      }
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // LOGIC: Optimistic UI xóa sản phẩm
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}"?`)) return;
    const previousProducts = [...products];
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await deleteProduct(id);
    } catch (error: unknown) {
      setProducts(previousProducts);
      let message = 'Xóa sản phẩm thất bại.';
      if (error instanceof AxiosError) {
        const res = error.response?.data as ApiResponse | undefined;
        if (res?.message) message = res.message;
      }
      alert(message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Package className="text-blue-600 dark:text-blue-400" size={26} />
            <span>Quản lý Sản phẩm</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Danh sách sản phẩm kinh doanh và quản lý thư viện hình ảnh đi kèm
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          <span>Thêm sản phẩm</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm theo tên..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-slate-400 shrink-0" />
          <select
            value={statusFilter === undefined ? 'all' : String(statusFilter)}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'all') {
                setStatusFilter(undefined);
              } else {
                setStatusFilter(Number(val));
              }
              setPage(1);
            }}
            className="w-full sm:w-48 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="1">Hoạt động (Active)</option>
            <option value="0">Tạm ngưng (Inactive)</option>
          </select>
        </div>
      </div>

      {/* Products Table - UI: Sử dụng table-layout: fixed và colgroup theo chuẩn 3.1 */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Loader2 size={32} className="animate-spin text-blue-600" />
            <p className="text-sm font-medium">Đang tải dữ liệu sản phẩm...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <Package size={48} className="mx-auto opacity-30 mb-2" />
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
              Không tìm thấy sản phẩm nào
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Thử thay đổi bộ lọc hoặc thêm sản phẩm mới
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm table-fixed">
              <colgroup>
                <col className="w-[12%]" />
                <col className="w-[38%]" />
                <col className="w-[20%]" />
                <col className="w-[15%]" />
                <col className="w-[15%]" />
              </colgroup>
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Ảnh</th>
                  <th className="px-6 py-3.5">Tên sản phẩm</th>
                  <th className="px-6 py-3.5">Giá niêm yết</th>
                  <th className="px-6 py-3.5">Trạng thái</th>
                  <th className="px-6 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {products.map((product) => {
                  const mediaList = getMediaList(product.media);
                  const mainImage = mediaList.find((m) => m.id) || mediaList[0];

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                          {mainImage ? (
                            <img
                              src={mainImage.url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon size={20} className="text-slate-400" />
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {product.id}</p>
                      </td>

                      <td className="px-6 py-4 font-semibold text-blue-600 dark:text-blue-400 font-mono">
                        {Number(product.price).toLocaleString('vi-VN')} đ
                      </td>

                      <td className="px-6 py-4">
                        {Number(product.status) === 1 ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 size={12} /> Hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            Tạm ngưng
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedMediaProduct(product);
                              setIsMediaModalOpen(true);
                            }}
                            className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors"
                            title="Quản lý Media"
                          >
                            <ImageIcon size={18} />
                          </button>

                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setIsModalOpen(true);
                            }}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit3 size={18} />
                          </button>

                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Trang {page} / {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 transition-colors"
              >
                Trước
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 transition-colors"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleCreateOrUpdate}
        product={editingProduct}
        isLoading={isSubmitting}
      />

      {/* Product Media Modal */}
      <ProductMediaModal
        isOpen={isMediaModalOpen}
        onClose={() => {
          setIsMediaModalOpen(false);
          setSelectedMediaProduct(null);
        }}
        product={selectedMediaProduct}
        onMediaUpdated={fetchProducts}
      />
    </div>
  );
}
