import axios from '@/shared/api/axios';
import generateQuery from '@/shared/lib/generateQuery';
import type { ProductList, ProductDetail } from '../model/types';

export async function getProducts(options: object = {}) {
  const query = generateQuery(options);
  return await axios.get<{
    results: ProductList[];
    count: number;
  }>(`/api/admin/product/v2/product/${query}`);
}

export async function getProduct(id: string) {
  return await axios.get<ProductDetail>(`/api/admin/product/v2/${id}/product/`);
}

export async function bulkDeleteProducts(ids: number[]) {
  return await axios.delete('/api/admin/product/v2/product/bulk-delete/', {
    data: {
      ids: ids,
    },
  });
}
