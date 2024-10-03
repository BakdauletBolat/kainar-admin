import generateQuery from "@/utils/generateQuery";

const getWarehouses = (object: any) => {
  const query = generateQuery(object);
  return axiosIns.get(`/api/stock/warehouses/${query}`);
};

import { defineStore } from "pinia";
import axiosIns from "@/apis";
import { Category } from "./category-storage";

export interface WarehouseList {
  id: number;
  name: string;
  categories: Category[];
  city: {
    id: number;
    name: string;
  };
}

export const useWarehouseStore = defineStore("warehouse-store", {
  state: () => {
    return {
      warehouses: [] as WarehouseList[],
      isLoading: false,
    };
  },
  actions: {
    async loadWarehouses(options: object) {
      this.isLoading = true;
      getWarehouses(options)
        .then((res) => {
          this.warehouses = res.data.results;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
  getters: {
    warehousesOptions: (state) =>
      state.warehouses.map((warehouse) => {
        return {
          label: warehouse.name,
          value: warehouse.id,
        };
      }),
  },
});
