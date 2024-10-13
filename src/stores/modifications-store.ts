import { defineStore } from "pinia";
import axiosInstance from "@/apis";
import type { IDefaultAPI } from "@/apis/interfaces";

export const useModificationsStore = defineStore("modifications-store", {
  state: () => {
    return {
      modifications: [] as IDefaultAPI[],
      searchManufacturers: [] as IDefaultAPI[],
      isLoadingModelCarList: false as boolean,
    };
  },
  actions: {
    async loadModifications(modelCar: number) {
      return axiosInstance
        .get(`/api/car/modifications/?modelCar=${modelCar}`)
        .then((res) => {
          this.modifications = res.data.results;
          return res.data.results;
        });
    },
  },
});
