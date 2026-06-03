import {
  normalizeProduct,
  type ApiProduct,
  type Category,
  type Product,
  type ProductPayload,
} from '../types/product';
import { api } from './httpClient';

export type Sort = 'asc' | 'desc';

export interface ListProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: Category;
  sortTitle?: Sort;
  sortPrice?: Sort;
}

interface ListProductsResponse {
  data: ApiProduct[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface ProductsList {
  data: Product[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export async function fetchProducts(
  params: ListProductsParams = {},
): Promise<ProductsList> {
  const response = await api.get<ListProductsResponse>('/products', {
    params: removeEmptyParams(params),
  });

  return {
    data: response.data.data.map(normalizeProduct),
    total: response.data.total,
    currentPage: response.data.currentPage,
    totalPages: response.data.totalPages,
  };
}

export async function fetchProductById(id: string) {
  const response = await api.get<ApiProduct>(`/products/${id}`);
  return normalizeProduct(response.data);
}

export async function createProduct(data: ProductPayload) {
  const response = await api.post<ApiProduct>('/products', data);
  return normalizeProduct(response.data);
}

export async function updateProduct(id: string, data: ProductPayload) {
  const response = await api.patch<ApiProduct>(`/products/${id}`, data);
  return normalizeProduct(response.data);
}

export async function deleteProduct(id: string) {
  await api.delete<ApiProduct | null>(`/products/${id}`);
}

function removeEmptyParams(params: ListProductsParams) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== '',
    ),
  );
}
