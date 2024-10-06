import generateQuery from "@/utils/generateQuery";
import { defineStore } from "pinia";
import axiosIns from "@/apis";
import { Category } from "./category-storage";

const getWarehouses = (object: any) => {
  const query = generateQuery(object);
  return axiosIns.get(`/api/stock/warehouses/${query}`);
};

const getWarehouse = (id: number) => {
  return axiosIns.get(`/api/stock/warehouses/${id}/`);
};

export interface WarehouseList {
  id: string;
  name: string;
  min_stock_level: number;
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
      warehouse: {
        id: "0",
        name: "",
        min_stock_level: 0,
        city: {
          name: "",
        },
      } as WarehouseList,
      itemCount: 0 as number,
    };
  },
  actions: {
    async loadWarehouses(options: object) {
      this.isLoading = true;
      await getWarehouses(options)
        .then((res) => {
          this.warehouses = res.data.results;
          this.itemCount = res.data.count;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async loadWarehouse(id: number) {
      this.isLoading = false;
      await getWarehouse(id)
        .then((res) => {
          this.warehouse = res.data;
        })
        .finally(() => (this.isLoading = false));
    },
    async removeWarehouse(id: string) {
      this.isLoading = false;
      await axiosIns.delete(`/api/stock/warehouses/${id}/`);
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
