export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  email?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface CustomerListParams {
  page?: number;
  limit?: number;
  search?: string;
  trashed?: 'only' | 'with';
}

export interface CreateCustomerInput {
  name: string;
  phone: string;
  address: string;
  email?: string;
}

export interface UpdateCustomerInput {
  id: string;
  name?: string;
  phone?: string;
  address?: string;
  email?: string;
}
