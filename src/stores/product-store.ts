import { defineStore } from "pinia";
import {getProducts, ProductList} from "@/apis/products";

export const useProductStore = defineStore("product-store", {
  state: () => {
    return {
      products: [] as ProductList[],
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
        })
        .finally(() => {
          this.isLoadingProducts = false;
        });
    },
    loadPopularProducts(options: object) {
      const popularOptions = { page_size: 4, ...options };
      getProducts(popularOptions).then((res) => {
        this.popularProducts = res.data.results;
      });
    },
  },
});
