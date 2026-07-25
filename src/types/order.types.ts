export type OrderStatus = 1 | 2 | 5; // 1 = PENDING, 2 = COMPLETED, 5 = CANCELLED

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  product_name?: string;
  product_name_snapshot?: string;
  quantity: number;
  unit_price: number;
  total_item_price?: number;
  subtotal?: number;
  price_override_reason?: string;
}

export interface Order {
  id: string;
  code: string;
  customer_id: string;
  customer_name?: string;
  customer_phone?: string;
  total_amount: number;
  status: OrderStatus;
  payment_method?: number;
  bank_name?: string | null;
  bank_account_number?: string | null;
  credit_days?: number | null;
  note?: string | null;
  cancel_reason?: string | null;
  items?: OrderItem[] | Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

// LOGIC: Bóc tách danh sách món hàng trong đơn an toàn, xử lý cả mảng trực tiếp và Fractal wrapper { data: [...] }
export const getOrderItemList = (items: unknown): OrderItem[] => {
  if (!items) return [];
  let rawList: unknown[] = [];
  if (Array.isArray(items)) {
    rawList = items;
  } else if (typeof items === 'object' && items !== null) {
    if ('data' in items && Array.isArray((items as { data: unknown }).data)) {
      rawList = (items as { data: unknown[] }).data;
    } else {
      rawList = Object.values(items);
    }
  }

  return rawList
    .filter(
      (item): item is Record<string, unknown> =>
        typeof item === 'object' && item !== null
    )
    .map((item) => {
      const name = String(
        item.product_name_snapshot || item.product_name || 'Sản phẩm'
      );
      const unitPrice = Number(item.unit_price || 0);
      const qty = Number(item.quantity || 1);
      const total = Number(
        item.total_item_price || item.subtotal || unitPrice * qty
      );

      return {
        id: String(item.id || ''),
        product_id: String(item.product_id || ''),
        product_name: name,
        product_name_snapshot: name,
        quantity: qty,
        unit_price: unitPrice,
        total_item_price: total,
        subtotal: total,
        price_override_reason: item.price_override_reason
          ? String(item.price_override_reason)
          : undefined,
      };
    });
};

export interface OrderListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus;
}

export interface CreateOrderItemInput {
  product_id: string;
  quantity: number;
  unit_price?: number;
  price_override_reason?: string;
}

export interface CreateOrderInput {
  customer_id?: string;
  customer_name_snapshot?: string;
  customer_phone_snapshot?: string;
  customer_address_snapshot?: string;
  payment_method: number;
  delivery_date?: string;
  shipping_carrier?: string;
  bank_name?: string;
  bank_account_number?: string;
  credit_days?: number;
  shipping_fee?: number;
  advance_payment?: number;
  items: CreateOrderItemInput[];
}

export interface CompleteOrderInput {
  id: string;
  delivery_date?: string;
  shipping_carrier?: string;
}

export interface CancelOrderInput {
  id: string;
  cancel_reason: string;
}
