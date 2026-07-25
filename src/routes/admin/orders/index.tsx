import { useState, useEffect, useCallback } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ShoppingCart, Plus, Search, Filter, CheckCircle2, XCircle, Trash2, Clock, Phone, Loader2 } from 'lucide-react';
import type { Order, OrderStatus, CompleteOrderInput, CancelOrderInput } from '@/features/orders/types';
import { getOrders, completeOrder, cancelOrder, deleteOrder } from '@/features/orders/api/ordersApi';
import { CompleteOrderModal } from '@/features/orders/components/CompleteOrderModal';
import { CancelOrderModal } from '@/features/orders/components/CancelOrderModal';
import { useRealtimeSync } from '@/features/real-time/hooks/useRealtimeSync';

export const Route = createFileRoute('/admin/orders/')({
  component: OrdersPage,
});

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>(undefined);

  // Modals state
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
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
    } catch (error) {
      console.error('Lỗi tải danh sách đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Real-time Soketi WebSocket listener for Orders
  useRealtimeSync({
    channel: 'orders',
    events: ['OrderCreated', 'OrderCompleted', 'OrderCancelled', 'OrderDeleted'],
    onEvent: () => {
      fetchOrders();
    },
  });

  const handleCompleteConfirm = async (data: CompleteOrderInput) => {
    if (!selectedOrder) return;
    const previousOrders = [...orders];
    try {
      setActionLoading(true);
      // Optimistic Status Update to Completed (2) - 0ms Latency
      setOrders((prev) => {
        const updated = prev.map((o) => (o.id === selectedOrder.id ? { ...o, status: 2 as OrderStatus } : o));
        if (statusFilter !== undefined) {
          return updated.filter((o) => Number(o.status) === Number(statusFilter));
        }
        return updated;
      });
      setCompleteModalOpen(false);
      await completeOrder(selectedOrder.id, data);
      setSelectedOrder(null);
    } catch (err: any) {
      setOrders(previousOrders); // Rollback on error
      alert(err?.response?.data?.message || 'Hoàn thành đơn hàng thất bại.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelConfirm = async (data: CancelOrderInput) => {
    if (!selectedOrder) return;
    const previousOrders = [...orders];
    try {
      setActionLoading(true);
      // Optimistic Status Update to Cancelled (5) - 0ms Latency
      setOrders((prev) => {
        const updated = prev.map((o) => (o.id === selectedOrder.id ? { ...o, status: 5 as OrderStatus } : o));
        if (statusFilter !== undefined) {
          return updated.filter((o) => Number(o.status) === Number(statusFilter));
        }
        return updated;
      });
      setCancelModalOpen(false);
      await cancelOrder(selectedOrder.id, data);
      setSelectedOrder(null);
    } catch (err: any) {
      setOrders(previousOrders); // Rollback on error
      alert(err?.response?.data?.message || 'Hủy đơn hàng thất bại.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (order: Order) => {
    if (order.status !== 1) {
      alert('Chỉ đơn hàng ở trạng thái PENDING mới được phép xóa.');
      return;
    }
    if (Number(order.advance_payment) > 0) {
      alert('Chỉ đơn hàng Pending chưa có tiền cọc (advance_payment = 0) mới được phép xóa.');
      return;
    }
    if (!confirm(`Bạn có chắc chắn muốn xóa đơn hàng "${order.code}"?`)) return;

    const previousOrders = [...orders];
    // Optimistic Delete - 0ms Latency
    setOrders((prev) => prev.filter((o) => o.id !== order.id));
    try {
      await deleteOrder(order.id);
    } catch (err: any) {
      setOrders(previousOrders); // Rollback on error
      alert(err?.response?.data?.message || 'Xóa đơn hàng thất bại.');
    }
  };

  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
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

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Loader2 size={32} className="animate-spin text-amber-600" />
            <p className="text-sm font-medium">Đang tải danh sách đơn hàng...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <ShoppingCart size={48} className="mx-auto opacity-30 mb-2" />
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300">Chưa có đơn hàng nào</p>
            <p className="text-xs text-slate-500 mt-1">Tạo đơn hàng mới để bắt đầu quy trình</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Mã đơn</th>
                  <th className="px-6 py-3.5">Khách hàng Snapshot</th>
                  <th className="px-6 py-3.5">Tổng tiền</th>
                  <th className="px-6 py-3.5">Cọc / Còn lại</th>
                  <th className="px-6 py-3.5">Trạng thái</th>
                  <th className="px-6 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {order.code}
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{order.customer_name_snapshot}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 font-mono mt-0.5">
                        <Phone size={12} /> {order.customer_phone_snapshot}
                      </p>
                    </td>

                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">
                      {Number(order.total_amount).toLocaleString('vi-VN')} đ
                    </td>

                    <td className="px-6 py-4 text-xs">
                      <p className="text-slate-500">Cọc: <span className="font-semibold text-slate-700 dark:text-slate-300">{Number(order.advance_payment).toLocaleString()} đ</span></p>
                      <p className="text-rose-500 font-semibold mt-0.5">Còn: {Number(order.remaining_amount).toLocaleString()} đ</p>
                    </td>

                    <td className="px-6 py-4">
                      {renderStatusBadge(order.status)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.status === 1 && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setCompleteModalOpen(true);
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
                                setCancelModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                              title="Hủy đơn"
                            >
                              <XCircle size={14} />
                              <span>Hủy đơn</span>
                            </button>

                            {Number(order.advance_payment) === 0 && (
                              <button
                                onClick={() => handleDelete(order)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors"
                                title="Xóa đơn (Pending & không cọc)"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
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

      {/* Modals */}
      <CompleteOrderModal
        isOpen={completeModalOpen}
        onClose={() => {
          setCompleteModalOpen(false);
          setSelectedOrder(null);
        }}
        onConfirm={handleCompleteConfirm}
        order={selectedOrder}
        isLoading={actionLoading}
      />

      <CancelOrderModal
        isOpen={cancelModalOpen}
        onClose={() => {
          setCancelModalOpen(false);
          setSelectedOrder(null);
        }}
        onConfirm={handleCancelConfirm}
        order={selectedOrder}
        isLoading={actionLoading}
      />
    </div>
  );
}
