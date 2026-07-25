import React from 'react';
import {
  X,
  ShoppingCart,
  User,
  Phone,
  MapPin,
  Calendar,
  Truck,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  AlertCircle,
} from 'lucide-react';
import type { Order, OrderStatus } from '@/types';
import { getOrderItemList } from '@/types';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onOpenComplete?: (order: Order) => void;
  onOpenCancel?: (order: Order) => void;
}

// UI: OrderDetailModal hiển thị chi tiết đơn hàng với Z-Index cố định z-[10000] theo chuẩn 3.3
export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  order,
  onOpenComplete,
  onOpenCancel,
}) => {
  if (!isOpen || !order) return null;

  const itemList = getOrderItemList(order.items);

  const renderStatusBadge = (status: OrderStatus) => {
    switch (Number(status)) {
      case 1:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <Clock size={14} /> Pending (1 - Cần xử lý)
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 size={14} /> Completed (2 - Hoàn thành)
          </span>
        );
      case 5:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            <XCircle size={14} /> Cancelled (5 - Đã hủy)
          </span>
        );
      default:
        return null;
    }
  };

  const getPaymentMethodName = (method?: number) => {
    switch (Number(method)) {
      case 1:
        return 'Ship COD (Giao hàng thu tiền)';
      case 2:
        return 'Tiền mặt (CASH tại cửa hàng)';
      case 3:
        return 'Chuyển khoản (BANK_TRANSFER)';
      case 4:
        return `Công nợ (CREDIT ${order.credit_days ? `- ${order.credit_days} ngày` : ''})`;
      default:
        return 'Khác';
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <ShoppingCart size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">
                  {order.code}
                </h3>
                {renderStatusBadge(order.status)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ngày khởi tạo:{' '}
                {order.created_at ? new Date(order.created_at).toLocaleString('vi-VN') : 'N/A'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Customer & Delivery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Box */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-700/60 pb-2">
                <User size={14} className="text-amber-500" /> Thông tin Khách hàng
              </h4>
              <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                {order.customer_name_snapshot || order.customer_name}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-mono">
                <Phone size={12} className="text-slate-400" />{' '}
                {order.customer_phone_snapshot || order.customer_phone || 'Chưa cập nhật'}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />{' '}
                {order.customer_address_snapshot || 'Chưa cung cấp địa chỉ'}
              </p>
            </div>

            {/* Delivery & Payment Info Box */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-700/60 pb-2">
                <Truck size={14} className="text-amber-500" /> Vận chuyển & Thanh toán
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                <span className="font-bold text-slate-500">Phương thức:</span>{' '}
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {getPaymentMethodName(order.payment_method)}
                </span>
              </p>

              {Number(order.payment_method) === 3 && order.bank_name && (
                <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Building2 size={12} className="text-slate-400" /> {order.bank_name} -{' '}
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    {order.bank_account_number}
                  </span>
                </p>
              )}

              {order.shipping_carrier && (
                <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Truck size={12} className="text-slate-400" /> {order.shipping_carrier}
                </p>
              )}

              {order.delivery_date && (
                <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-mono">
                  <Calendar size={12} className="text-slate-400" /> Giao hàng: {order.delivery_date}
                </p>
              )}

              {Number(order.status) === 5 && order.cancel_reason && (
                <div className="mt-2 p-2 bg-rose-50 dark:bg-rose-950/40 rounded-lg border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-1.5">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Lý do hủy:</span> {order.cancel_reason}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Package size={14} className="text-amber-500" /> Danh sách sản phẩm trong đơn (
              {itemList.length})
            </h4>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs table-fixed">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase">
                  <tr>
                    <th className="px-4 py-2.5">Sản phẩm</th>
                    <th className="px-4 py-2.5 text-right">Đơn giá</th>
                    <th className="px-4 py-2.5 text-center">SL</th>
                    <th className="px-4 py-2.5 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {itemList.length > 0 ? (
                    itemList.map((item, idx) => (
                      <tr
                        key={item.id || idx}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                      >
                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                            {item.product_name_snapshot || item.product_name}
                          </p>
                          {item.price_override_reason && (
                            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                              Lý do sửa giá: {item.price_override_reason}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-mono">
                          {Number(item.unit_price).toLocaleString('vi-VN')} đ
                        </td>
                        <td className="px-4 py-3 text-center font-bold">{item.quantity}</td>
                        <td className="px-4 py-3 text-right font-bold font-mono text-slate-900 dark:text-slate-100">
                          {Number(
                            item.total_item_price ||
                              item.subtotal ||
                              Number(item.unit_price) * item.quantity
                          ).toLocaleString('vi-VN')}{' '}
                          đ
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                        Không có thông tin chi tiết sản phẩm.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 max-w-sm ml-auto space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Tạm tính (Subtotal):</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {Number(order.subtotal || order.total_amount).toLocaleString('vi-VN')} đ
              </span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Phí vận chuyển:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {Number(order.shipping_fee || 0).toLocaleString('vi-VN')} đ
              </span>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700/60 pt-2 flex justify-between font-bold text-sm text-slate-900 dark:text-slate-100">
              <span>Tổng cộng đơn hàng:</span>
              <span className="text-amber-600 dark:text-amber-400">
                {Number(order.total_amount).toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* IMPORTANT: Chuyển tiếp sequential modal transition chuẩn theo 3.3 */}
            {Number(order.status) === 1 && onOpenComplete && (
              <button
                onClick={() => {
                  onClose();
                  onOpenComplete(order);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 size={16} />
                <span>Hoàn thành đơn</span>
              </button>
            )}

            {Number(order.status) === 1 && onOpenCancel && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCancel(order);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <XCircle size={16} />
                <span>Hủy đơn</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
