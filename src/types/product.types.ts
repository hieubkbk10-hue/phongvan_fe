export interface MediaItem {
  id: string;
  url: string;
  name?: string;
  size?: number;
  mime_type?: string;
  is_main?: boolean;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  code?: string;
  sku?: string;
  price: number;
  cost_price?: number;
  stock_quantity: number;
  status?: number;
  description?: string | null;
  category?: string | null;
  image_url?: string | null;
  media?: MediaItem[] | Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: number;
}

export interface CreateProductInput {
  name: string;
  price: number;
  status?: number;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string;
}

// LOGIC: Bóc tách danh sách media an toàn, không sử dụng `any`
export const getMediaList = (media: unknown): MediaItem[] => {
  if (!media) return [];
  if (Array.isArray(media)) return media as MediaItem[];
  if (typeof media === 'object' && media !== null) {
    const values = Object.values(media);
    if (values.every((item) => typeof item === 'object' && item !== null && 'url' in item)) {
      return values as MediaItem[];
    }
  }
  return [];
};
