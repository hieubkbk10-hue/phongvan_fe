import { useState, useEffect, useCallback } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Trash2,
  Clock,
  Phone,
  Loader2,
  Eye,
} from 'lucide-react';
import { AxiosError } from 'axios';
import type {
  Order,
  OrderStatus,
  CompleteOrderInput,
  CancelOrderInput,
  ApiResponse,
} from '@/types';
import {
  getOrders,
  completeOrder,
  cancelOrder,
  deleteOrder,
} from '@/features/orders/api/ordersApi';
import { CompleteOrderModal } from '@/features/orders/components/CompleteOrderModal';
import { CancelOrderModal } from '@/features/orders/components/CancelOrderModal';
import { OrderDetailModal } from '@/features/orders/components/OrderDetailModal';
import { useRealtimeSync } from '@/features/real-time/hooks/useRealtimeSync';

export const Route = createFileRoute('/admin/orders/')({
  component: OrdersPage,
});

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  // UI: Quản lý trạng thái loading và các modal thoại theo chuẩn is[Feature][State]
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>(undefined);

  // Modals state
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // LOGIC: Tải danh sách đơn hàng có phân trang và lọc theo trạng thái
  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getOrders({
        page,
        limit: 10,
        search: search || undefined,
        status: statusFilter,
      });

      let items = Array.isArray(result.data) ? result.data : [];
      if (statusFilter !== undefined) {
        items = items.filter((o) => Number(o.status) === Number(statusFilter));
      }

      setOrders(items);
      if (result.meta?.pagination) {
        setTotalPages(result.meta.pagination.total_pages);
      } else {
        setTotalPages(1);
      }
    } catch (error: unknown) {
      console.error('Lỗi tải danh sách đơn hàng:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // LOGIC: Soketi WebSocket listener tự động làm mới khi có sự kiện đơn hàng
  useRealtimeSync({
    channel: 'orders',
    events: ['OrderCreated', 'OrderCompleted', 'OrderCancelled', 'OrderDeleted'],
    onEvent: () => {
      fetchOrders();
    },
  });

  // LOGIC: Optimistic UI cập nhật tức thì trạng thái sang Completed (2)
  const handleCompleteConfirm = async (data: CompleteOrderInput) => {
    if (!selectedOrder) return;
    const previousOrders = [...orders];
    try {
      setIsActionLoading(true);
      setOrders((prev) => {
        const updated = prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: 2 as OrderStatus } : o
        );
        if (statusFilter !== undefined) {
          return updated.filter((o) => Number(o.status) === Number(statusFilter));
        }
        return updated;
      });
      setIsCompleteModalOpen(false);
      await completeOrder(selectedOrder.id, data);
      setSelectedOrder(null);
      await fetchOrders();
    } catch (err: unknown) {
      setOrders(previousOrders); // LOGIC: Rollback khi API lỗi
      let message = 'Hoàn thành đơn hàng thất bại.';
      if (err instanceof AxiosError) {
        const res = err.response?.data as ApiResponse | undefined;
        if (res?.message) message = res.message;
      }
      alert(message);
    } finally {
      setIsActionLoading(false);
    }
  };

  // LOGIC: Optimistic UI cập nhật tức thì trạng thái sang Cancelled (5)
  const handleCancelConfirm = async (data: CancelOrderInput) => {
    if (!selectedOrder) return;
    const previousOrders = [...orders];
    try {
      setIsActionLoading(true);
      setOrders((prev) => {
        const updated = prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: 5 as OrderStatus } : o
        );
        if (statusFilter !== undefined) {
          return updated.filter((o) => Number(o.status) === Number(statusFilter));
        }
        return updated;
      });
      setIsCancelModalOpen(false);
      await cancelOrder(selectedOrder.id, data);
      setSelectedOrder(null);
      await fetchOrders();
    } catch (err: unknown) {
      setOrders(previousOrders); // LOGIC: Rollback khi API lỗi
      let message = 'Hủy đơn hàng thất bại.';
      if (err instanceof AxiosError) {
        const res = err.response?.data as ApiResponse | undefined;
        if (res?.message) message = res.message;
      }
      alert(message);
    } finally {
      setIsActionLoading(false);
    }
  };

  // QUYỀN: Chỉ cho phép xóa đơn hàng ở trạng thái PENDING và chưa cọc (advance_payment = 0)
  const handleDelete = async (order: Order) => {
    if (order.status !== 1) {
      alert('Chỉ đơn hàng ở trạng thái PENDING mới được phép xóa.');
      return;
    }
    if (!confirm(`Bạn có chắc chắn muốn xóa đơn hàng "${order.code}"?`)) return;

    const previousOrders = [...orders];
    setOrders((prev) => prev.filter((o) => o.id !== order.id));
    try {
      await deleteOrder(order.id);
      await fetchOrders();
    } catch (err: unknown) {
      setOrders(previousOrders);
      let message = 'Xóa đơn hàng thất bại.';
      if (err instanceof AxiosError) {
        const res = err.response?.data as ApiResponse | undefined;
        if (res?.message) message = res.message;
      }
      alert(message);
    }
  };

  const renderStatusBadge = (status: OrderStatus) => {
    switch (Number(status)) {
      case 1:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 animate-pulse">
            <Clock size={12} /> Pending (1)
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 size={12} /> Completed (2)
          </span>
        );
      case 5:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            <XCircle size={12} /> Cancelled (5)
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <ShoppingCart className="text-amber-600 dark:text-amber-400" size={26} />
            <span>Quản lý Đơn hàng</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Quy trình tạo đơn, lưu snapshot thông tin, hoàn thành giao hàng hoặc hủy đơn
          </p>
        </div>

        <Link
          to="/admin/orders/create"
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          <span>Tạo đơn hàng</span>
        </Link>
      </div>

      {/* Filter & Search Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn (ORD-...) hoặc tên/SĐT khách hàng..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-slate-400 shrink-0" />
          <select
            value={statusFilter === undefined ? 'all' : String(statusFilter)}
            onChange={(e) => {
              const val = e.target.value;
              setStatusFilter(val === 'all' ? undefined : (Number(val) as OrderStatus));
              setPage(1);
            }}
            className="w-full sm:w-52 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 outline-none focus:border-amber-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="1">Pending (1 - Cần xử lý)</option>
            <option value="2">Completed (2 - Hoàn thành)</option>
            <option value="5">Cancelled (5 - Đã hủy)</option>
          </select>
        </div>
      </div>

      {/* Orders Table - UI: Sử dụng table-layout: fixed và colgroup theo chuẩn 3.1 */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Loader2 size={32} className="animate-spin text-amber-600" />
            <p className="text-sm font-medium">Đang tải danh sách đơn hàng...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <ShoppingCart size={48} className="mx-auto opacity-30 mb-2" />
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
              Chưa có đơn hàng nào
            </p>
            <p className="text-xs text-slate-500 mt-1">Tạo đơn hàng mới để bắt đầu quy trình</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm table-fixed">
              <colgroup>
                <col className="w-[20%]" />
                <col className="w-[25%]" />
                <col className="w-[18%]" />
                <col className="w-[17%]" />
                <col className="w-[20%]" />
              </colgroup>
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Mã đơn</th>
                  <th className="px-6 py-3.5">Khách hàng</th>
                  <th className="px-6 py-3.5">Tổng tiền</th>
                  <th className="px-6 py-3.5">Trạng thái</th>
                  <th className="px-6 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono font-bold">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsDetailModalOpen(true);
                        }}
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5"
                        title="Xem chi tiết đơn hàng"
                      >
                        <span>{order.code}</span>
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                        {order.customer_name}
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 font-mono mt-0.5 truncate">
                        <Phone size={12} /> {order.customer_phone || 'N/A'}
                      </p>
                    </td>

                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100 font-mono">
                      {Number(order.total_amount).toLocaleString('vi-VN')} đ
                    </td>

                    <td className="px-6 py-4">{renderStatusBadge(order.status)}</td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDetailModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="Xem chi tiết đơn hàng"
                        >
                          <Eye size={16} />
                        </button>

                        {Number(order.status) === 1 && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsCompleteModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                              title="Hoàn thành đơn"
                            >
                              <CheckCircle2 size={14} />
                              <span>Hoàn thành</span>
                            </button>

                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsCancelModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                              title="Hủy đơn"
                            >
                              <XCircle size={14} />
                              <span>Hủy đơn</span>
                            </button>

                            <button
                              onClick={() => handleDelete(order)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors"
                              title="Xóa đơn (Pending)"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
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

      {/* Detail Modal */}
      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onOpenComplete={(ord) => {
          setSelectedOrder(ord);
          setIsCompleteModalOpen(true);
        }}
        onOpenCancel={(ord) => {
          setSelectedOrder(ord);
          setIsCancelModalOpen(true);
        }}
      />

      {/* Complete Modal */}
      <CompleteOrderModal
        isOpen={isCompleteModalOpen}
        onClose={() => {
          setIsCompleteModalOpen(false);
          setSelectedOrder(null);
        }}
        onConfirm={handleCompleteConfirm}
        order={selectedOrder}
        isLoading={isActionLoading}
      />

      {/* Cancel Modal */}
      <CancelOrderModal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setSelectedOrder(null);
        }}
        onConfirm={handleCancelConfirm}
        order={selectedOrder}
        isLoading={isActionLoading}
      />
    </div>
  );
}
