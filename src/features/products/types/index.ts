export interface MediaItem {
  id: string;
  url: string;
  file_name?: string;
  is_main: boolean;
  sort_order?: number;
}

export interface Product {
  id: string;
  name: string;
  price: string | number;
  status: 0 | 1; // 0 = INACTIVE, 1 = ACTIVE
  created_at?: string;
  updated_at?: string;
  media?: MediaItem[];
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: number;
}

export interface CreateProductInput {
  name: string;
  price: number | string;
  status: 0 | 1;
}

export interface UpdateProductInput {
  id: string;
  name?: string;
  price?: number | string;
  status?: 0 | 1;
}
