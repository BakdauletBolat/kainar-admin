import { defineStore } from "pinia";
import {getProducts, ProductList, getProduct} from "@/apis/products";
import {useAuthStore} from "@/stores/auth-store.ts";
import {useRouter} from "vue-router";
import axiosIns from "@/apis";

export const useProductStore = defineStore("product-store", {
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
        .catch(e=>{
          if (e.response.status === 401) {
            const authStore = useAuthStore();
            const router = useRouter();
            authStore.logout(router);
          }
        })
        .finally(() => {
          this.isLoadingProducts = false;
        });
    },
    async bulkDeleteProducts(ids: number[]) {
      try {
        axiosIns.delete("/api/admin/product/v2/product/bulk-delete/", {
          data: {
            ids: ids
          }
        })
      }
      catch (e) {
        console.error("Error deleting products:", e);
      }
    },
    async loadProduct(id: string) {
      this.isLoadingProducts = true;
      return await getProduct(id)
          .then((res) => {
            this.product = res.data;
          })
          .catch(e=>{
            if (e.response.status === 401) {
              const authStore = useAuthStore();
              const router = useRouter();
              authStore.logout(router);
            }
          })
          .finally(() => {
            this.isLoadingProducts = false;
          });
    }
  },
});
