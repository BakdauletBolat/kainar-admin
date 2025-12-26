import { defineStore } from 'pinia';
import { getProducts, getProduct, bulkDeleteProducts } from '../api/part.api';
import type { ProductList } from './types';

export const usePartStore = defineStore('part', {
  state: () => {
    return {
      products: [] as ProductList[],
      product: null as ProductList | null,
      productsCount: 0,
      isLoadingProducts: false,
      popularProducts: [] as ProductList[],
    };
  },
  actions: {
    async loadProducts(options: object) {
      this.isLoadingProducts = true;
      return await getProducts(options)
        .then((res) => {
          this.products = res.data.results;
          this.productsCount = res.data.count;
          return res.data;
        })
        .finally(() => {
          this.isLoadingProducts = false;
        });
    },
    async bulkDelete(ids: number[]) {
      try {
        await bulkDeleteProducts(ids);
      } catch (e) {
        console.error('Error deleting products:', e);
      }
    },
    async loadProduct(id: string) {
      this.isLoadingProducts = true;
      return await getProduct(id)
        .then((res) => {
          this.product = res.data as any;
        })
        .finally(() => {
          this.isLoadingProducts = false;
        });
    },
    // Alias for compatibility
    async bulkDeleteProducts(ids: number[]) {
      return await this.bulkDelete(ids);
    },
  },
});
