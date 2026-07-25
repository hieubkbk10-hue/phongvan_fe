import { apiClient } from '@/lib/api-client';
import type {
  Order,
  OrderListParams,
  CreateOrderInput,
  CompleteOrderInput,
  CancelOrderInput,
} from '@/types';

// LOGIC: Lấy danh sách đơn hàng có phân trang từ API
export const getOrders = async (params?: OrderListParams) => {
  const queryParams: Record<string, string | number> = {
    page: params?.page || 1,
    limit: params?.limit || 15,
    include: 'items,customer',
  };

  if (params?.status !== undefined) {
    queryParams.status = params.status;
  }

  if (params?.search && params.search.trim() !== '') {
    const s = params.search.trim();
    if (s.toUpperCase().startsWith('ORD-')) {
      queryParams.search = `code:${s}`;
    } else if (/^\+?[0-9]+$/.test(s)) {
      queryParams.search = `customer_phone_snapshot:${s}`;
    } else {
      queryParams.search = `customer_name_snapshot:${s}`;
    }
  }

  const response = await apiClient.get<{
    data: Order[];
    meta?: {
      pagination?: {
        total: number;
        count: number;
        per_page: number;
        current_page: number;
        total_pages: number;
      };
    };
  }>('/orders', {
    params: queryParams,
  });

  return response.data;
};

export const getOrderById = async (id: string) => {
  const response = await apiClient.get<{ data: Order }>(`/orders/${id}`, {
    params: { include: 'items,customer' },
  });
  return response.data.data;
};

export const createOrder = async (data: CreateOrderInput) => {
  const payload: Record<string, unknown> = {
    payment_method: Number(data.payment_method),
    items: data.items.map((item) => {
      const it: Record<string, unknown> = {
        product_id: item.product_id,
        quantity: Number(item.quantity),
      };
      if (item.unit_price !== undefined) it.unit_price = Number(item.unit_price);
      if (item.price_override_reason) it.price_override_reason = item.price_override_reason;
      return it;
    }),
  };

  if (data.customer_id) payload.customer_id = data.customer_id;
  if (data.customer_name_snapshot) payload.customer_name_snapshot = data.customer_name_snapshot;
  if (data.customer_phone_snapshot) payload.customer_phone_snapshot = data.customer_phone_snapshot;
  if (data.customer_address_snapshot) payload.customer_address_snapshot = data.customer_address_snapshot;
  if (data.delivery_date) payload.delivery_date = data.delivery_date;
  if (data.shipping_carrier) payload.shipping_carrier = data.shipping_carrier;
  if (data.bank_name) payload.bank_name = data.bank_name;
  if (data.bank_account_number) payload.bank_account_number = data.bank_account_number;
  if (data.credit_days !== undefined) payload.credit_days = Number(data.credit_days);
  if (data.shipping_fee !== undefined) payload.shipping_fee = Number(data.shipping_fee);
  if (data.advance_payment !== undefined) payload.advance_payment = Number(data.advance_payment);

  const response = await apiClient.post<{ data: Order }>('/orders', payload);
  return response.data.data;
};

export const completeOrder = async (
  id: string,
  { delivery_date, shipping_carrier }: CompleteOrderInput
) => {
  const payload: Record<string, unknown> = {};
  if (delivery_date) payload.delivery_date = delivery_date;
  if (shipping_carrier) payload.shipping_carrier = shipping_carrier;

  const response = await apiClient.post<{ data: Order }>(`/orders/${id}/complete`, payload);
  return response.data.data;
};

export const cancelOrder = async (id: string, { cancel_reason }: CancelOrderInput) => {
  const response = await apiClient.post<{ data: Order }>(`/orders/${id}/cancel`, {
    cancel_reason,
  });
  return response.data.data;
};

export const deleteOrder = async (id: string) => {
  const response = await apiClient.delete(`/orders/${id}`);
  return response.data;
};
