export type OrderStatus = 1 | 2 | 5; // 1 = PENDING, 2 = COMPLETED, 5 = CANCELLED

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  product_name?: string;
  quantity: number;
  unit_price: number;
  subtotal?: number;
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
  items?: OrderItem[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

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
