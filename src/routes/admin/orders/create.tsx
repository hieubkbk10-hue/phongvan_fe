import { useState, useEffect } from 'react';
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { ShoppingCart, ArrowLeft, Plus, Trash2, User, Package, DollarSign, Loader2 } from 'lucide-react';
import { getCustomers } from '@/features/customers/api/customersApi';
import { getProducts } from '@/features/products/api/productsApi';
import { createOrder } from '@/features/orders/api/ordersApi';
import type { Customer } from '@/features/customers/types';
import type { Product } from '@/features/products/types';
import type { CreateOrderItemInput } from '@/features/orders/types';

export const Route = createFileRoute('/admin/orders/create')({
  component: CreateOrderPage,
});

function CreateOrderPage() {
  const navigate = useNavigate();

  // Data sources
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Form states
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<number>(1); // 1 = CASH
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [advancePayment, setAdvancePayment] = useState<number>(0);

  const [items, setItems] = useState<
    {
      product_id: string;
      product_name: string;
      list_price: number;
      unit_price: number;
      quantity: number;
      price_override_reason: string;
    }[]
  >([]);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadInitData = async () => {
      try {
        setLoadingData(true);
        const [custRes, prodRes] = await Promise.all([
          getCustomers({ limit: 100 }),
          getProducts({ limit: 100, status: 1 }), // Active products only
        ]);
        setCustomers(custRes.data);
        setProducts(prodRes.data);
      } catch (err) {
        console.error('Lỗi nạp dữ liệu ban đầu:', err);
      } finally {
        setLoadingData(false);
      }
    };
    loadInitData();
  }, []);

  const handleSelectCustomer = (custId: string) => {
    setSelectedCustomerId(custId);
    const found = customers.find((c) => c.id === custId);
    if (found) {
      setCustomerName(found.name);
      setCustomerPhone(found.phone);
      setCustomerAddress(found.address);
    }
  };

  const handleAddItem = (productId: string) => {
    if (!productId) return;
    if (items.length >= 100) {
      alert('Tối đa 100 sản phẩm trong một đơn hàng.');
      return;
    }
    const found = products.find((p) => p.id === productId);
    if (!found) return;

    if (items.some((i) => i.product_id === productId)) {
      alert('Sản phẩm này đã được thêm vào danh sách.');
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        product_id: found.id,
        product_name: found.name,
        list_price: Number(found.price),
        unit_price: Number(found.price),
        quantity: 1,
        price_override_reason: '',
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  // Memory cents calculations
  const subtotalCents = items.reduce(
    (sum, item) => sum + Math.round(item.unit_price * 100) * item.quantity,
    0
  );
  const subtotal = subtotalCents / 100;
  const shippingFeeCents = Math.round(shippingFee * 100);
  const totalAmountCents = subtotalCents + shippingFeeCents;
  const totalAmount = totalAmountCents / 100;
  const advancePaymentCents = Math.round(advancePayment * 100);
  const remainingAmountCents = Math.max(0, totalAmountCents - advancePaymentCents);
  const remainingAmount = remainingAmountCents / 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      alert('Vui lòng chọn khách hàng.');
      return;
    }
    if (items.length === 0) {
      alert('Đơn hàng phải có ít nhất 1 sản phẩm.');
      return;
    }

    // Validate price override reason
    for (const item of items) {
      if (item.unit_price !== item.list_price && !item.price_override_reason.trim()) {
        alert(
          `Vui lòng nhập lý do thay đổi giá bán cho sản phẩm "${item.product_name}"`
        );
        return;
      }
    }

    if (advancePayment > totalAmount) {
      alert('Tiền cọc không được lớn hơn tổng giá trị đơn hàng.');
      return;
    }

    const payload = {
      customer_id: selectedCustomerId,
      customer_name_snapshot: customerName,
      customer_phone_snapshot: customerPhone,
      customer_address_snapshot: customerAddress,
      payment_method: Number(paymentMethod),
      shipping_fee: Number(shippingFee),
      advance_payment: Number(advancePayment),
      items: items.map((i) => ({
        product_id: i.product_id,
        unit_price: Number(i.unit_price),
        quantity: Number(i.quantity),
        ...(i.unit_price !== i.list_price
          ? { price_override_reason: i.price_override_reason }
          : {}),
      })),
    };

    try {
      setSubmitting(true);
      await createOrder(payload);
      navigate({ to: '/admin/orders' });
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Tạo đơn hàng thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-2">
        <Loader2 size={32} className="animate-spin text-amber-600" />
        <p className="text-sm font-medium">Đang tải danh sách khách hàng & sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin/orders"
          className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <ShoppingCart className="text-amber-600 dark:text-amber-400" size={26} />
            <span>Tạo Đơn hàng Mới</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Chọn khách hàng, thêm sản phẩm và thiết lập giá đơn hàng
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Customer Snapshot Information */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <User size={18} className="text-amber-500" />
            <span>Thông tin Khách hàng</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Chọn khách hàng từ hệ thống <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => handleSelectCustomer(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 outline-none focus:border-amber-500"
              >
                <option value="">-- Chọn khách hàng --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Tên hiển thị snapshot
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Số điện thoại snapshot
              </label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Địa chỉ giao hàng snapshot
              </label>
              <input
                type="text"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Order Items Selector */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Package size={18} className="text-amber-500" />
              <span>Danh sách Sản phẩm trong đơn ({items.length}/100)</span>
            </h2>

            <div className="flex items-center gap-2">
              <select
                onChange={(e) => {
                  handleAddItem(e.target.value);
                  e.target.value = '';
                }}
                className="px-3 py-1.5 text-xs bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-800 rounded-lg outline-none cursor-pointer"
              >
                <option value="">+ Thêm sản phẩm</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - {Number(p.price).toLocaleString()} đ
                  </option>
                ))}
              </select>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Package size={40} className="mx-auto opacity-30 mb-2" />
              <p className="text-sm font-medium">Chưa có sản phẩm nào được chọn.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => {
                const isPriceOverridden = item.unit_price !== item.list_price;

                return (
                  <div
                    key={item.product_id}
                    className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {index + 1}. {item.product_name}
                      </p>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-md transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-500 font-medium mb-1">
                          Giá niêm yết: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.list_price.toLocaleString()} đ</span>
                        </label>
                        <input
                          type="number"
                          value={item.unit_price}
                          onChange={(e) =>
                            handleItemChange(index, 'unit_price', Number(e.target.value))
                          }
                          className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-500 font-medium mb-1">Số lượng</label>
                        <input
                          type="number"
                          min={1}
                          max={999}
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(index, 'quantity', Math.max(1, Number(e.target.value)))
                          }
                          className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-500 font-medium mb-1">Thành tiền item</label>
                        <p className="px-3 py-1.5 font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-800">
                          {(item.unit_price * item.quantity).toLocaleString()} đ
                        </p>
                      </div>
                    </div>

                    {isPriceOverridden && (
                      <div>
                        <label className="block text-[11px] font-bold text-rose-500 uppercase mb-1">
                          Lý do ghi đè giá bán <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="VD: Chiết khấu cho khách sỉ, Khuyến mãi riêng..."
                          value={item.price_override_reason}
                          onChange={(e) =>
                            handleItemChange(index, 'price_override_reason', e.target.value)
                          }
                          className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 rounded-lg text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 3: Payment & Summary */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <DollarSign size={18} className="text-amber-500" />
            <span>Thanh toán & Tính tiền</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Phương thức thanh toán
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 outline-none focus:border-amber-500"
              >
                <option value={1}>Tiền mặt (CASH)</option>
                <option value={2}>Chuyển khoản (BANK_TRANSFER)</option>
                <option value={3}>Công nợ (CREDIT)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Phí vận chuyển (VNĐ)
              </label>
              <input
                type="number"
                min={0}
                value={shippingFee}
                onChange={(e) => setShippingFee(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Số tiền đặt cọc (VNĐ)
              </label>
              <input
                type="number"
                min={0}
                value={advancePayment}
                onChange={(e) => setAdvancePayment(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Calculations Card */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-sm max-w-sm ml-auto">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Tạm tính (Subtotal):</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{subtotal.toLocaleString()} đ</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Phí vận chuyển:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{shippingFee.toLocaleString()} đ</span>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-bold text-base text-slate-900 dark:text-slate-100">
              <span>Tổng đơn hàng:</span>
              <span className="text-amber-600 dark:text-amber-400">{totalAmount.toLocaleString()} đ</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Tiền cọc (Advance):</span>
              <span>{advancePayment.toLocaleString()} đ</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-rose-600 dark:text-rose-400">
              <span>Còn lại cần thu:</span>
              <span>{remainingAmount.toLocaleString()} đ</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <Link
            to="/admin/orders"
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Hủy bỏ
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            <span>Tạo đơn hàng</span>
          </button>
        </div>
      </form>
    </div>
  );
}
