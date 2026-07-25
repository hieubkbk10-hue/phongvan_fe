export type OrderStatus = 1 | 2 | 5; // 1 = PENDING, 2 = COMPLETED, 5 = CANCELLED

export interface OrderItem {
  id?: string;
  product_id: string;
  product_name_snapshot: string;
  product_price_snapshot?: number | string;
  unit_price: number | string;
  price_override_reason?: string | null;
  quantity: number;
  total_item_price: number | string;
}

export interface Order {
  id: string;
  code: string;
  customer_id: string;
  customer_name_snapshot: string;
  customer_phone_snapshot: string;
  customer_address_snapshot: string;
  delivery_date?: string | null;
  shipping_carrier?: string | null;
  payment_method: number; // 1 = CASH, 2 = BANK_TRANSFER, 3 = CREDIT
  credit_days?: number | null;
  bank_name?: string | null;
  bank_account_number?: string | null;
  subtotal: number | string;
  shipping_fee: number | string;
  total_amount: number | string;
  advance_payment: number | string;
  remaining_amount: number | string;
  status: OrderStatus;
  cancel_reason?: string | null;
  created_at?: string;
  updated_at?: string;
  items?: OrderItem[];
}

export interface OrderListParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  search?: string;
}

export interface CreateOrderItemInput {
  product_id: string;
  unit_price: number;
  quantity: number;
  price_override_reason?: string;
}

export interface CreateOrderInput {
  customer_id: string;
  customer_name_snapshot?: string;
  customer_phone_snapshot?: string;
  customer_address_snapshot?: string;
  payment_method: number;
  credit_days?: number;
  bank_name?: string;
  bank_account_number?: string;
  shipping_fee?: number;
  advance_payment?: number;
  items: CreateOrderItemInput[];
}

export interface CompleteOrderInput {
  delivery_date: string;
  shipping_carrier: string;
}

export interface CancelOrderInput {
  cancel_reason: string;
}
