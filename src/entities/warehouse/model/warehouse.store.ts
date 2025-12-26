import { defineStore } from 'pinia';
import { getWarehouses, getWarehouse, deleteWarehouse } from '../api/warehouse.api';
import type { WarehouseList } from './types';

export const useWarehouseStore = defineStore('warehouse', {
  state: () => {
    return {
      warehouses: [] as WarehouseList[],
      isLoading: false,
      warehouse: {
        id: '0',
        name: '',
        min_stock_level: 0,
        city: {
          name: '',
          id: 0,
        },
        categories: [],
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
      this.isLoading = true;
      return await getWarehouse(id)
        .then((res) => {
          this.warehouse = res.data;
          return this.warehouse;
        })
        .finally(() => (this.isLoading = false));
    },
    async removeWarehouse(id: string) {
      this.isLoading = false;
      await deleteWarehouse(id);
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
