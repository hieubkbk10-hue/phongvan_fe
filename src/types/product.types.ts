export interface MediaItem {
  id: string;
  url: string;
  name?: string;
  size?: number;
  mime_type?: string;
  is_main?: boolean;
  is_primary?: boolean;
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

// LOGIC: Bóc tách danh sách media an toàn, xử lý cả mảng trực tiếp và Fractal wrapper { data: [...] }
export const getMediaList = (media: unknown): MediaItem[] => {
  if (!media) return [];
  let rawItems: unknown[] = [];
  if (Array.isArray(media)) {
    rawItems = media;
  } else if (typeof media === 'object' && media !== null) {
    if ('data' in media && Array.isArray((media as { data: unknown }).data)) {
      rawItems = (media as { data: unknown[] }).data;
    } else {
      rawItems = Object.values(media);
    }
  }

  return rawItems
    .filter(
      (item): item is Record<string, unknown> =>
        typeof item === 'object' && item !== null && 'url' in item
    )
    .map((item) => {
      const isPrimary = Boolean(item.is_primary || item.is_main);
      return {
        id: String(item.id || ''),
        url: String(item.url || ''),
        name: item.name
          ? String(item.name)
          : item.filename
            ? String(item.filename)
            : undefined,
        size: typeof item.size === 'number' ? item.size : undefined,
        mime_type: item.mime_type ? String(item.mime_type) : undefined,
        is_main: isPrimary,
        is_primary: isPrimary,
        created_at: item.created_at ? String(item.created_at) : undefined,
      };
    });
};
