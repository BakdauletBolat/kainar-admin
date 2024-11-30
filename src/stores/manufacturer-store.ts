import { defineStore } from "pinia";
import axiosInstance from "@/apis";
import type { IDefaultAPI } from "@/apis/interfaces";

export const useManufacturerStore = defineStore("manufacturer-store", {
  state: () => {
    return {
      manufacturers: [] as IDefaultAPI[],
      searchManufacturers: [] as IDefaultAPI[],
      manufacturer: null as IDefaultAPI | null,
      modelCars: [] as any[],
      searchModelCars: [] as any[],
      isLoadingModelCarList: false as boolean,
    };
  },
  getters: {
    manufacturersByLetterGrouping: (state) => {
      return state.manufacturers.reduce((accumulator, currentItem) => {
        // Get the first letter of the current item and convert to uppercase
        const firstLetter = currentItem.name[0].toUpperCase();

        // Initialize the array for this letter if it doesn't exist
        // @ts-ignore
        if (!accumulator[firstLetter]) {
          // @ts-ignore
          accumulator[firstLetter] = [];
        }

        // Add the current item to the corresponding letter's array
        // @ts-ignore
        accumulator[firstLetter].push(currentItem);

        return accumulator;
      }, {});
    },
    manufacturerOptions: (state) => {
      return state.manufacturers.map((option) => {
        return {
          label: option.name,
          value: option.id,
        };
      });
    },
  },
  actions: {
    async loadManufacturers() {
      return axiosInstance.get("/api/car/manufacturers/").then((res) => {
        this.manufacturers = res.data.results;
        return res.data.results;
      });
    },
    async loadModelCars(manufacturerId: number) {
      return axiosInstance
        .get(`/api/car/models/?manufacturer=${manufacturerId}&page_size=1000`)
        .then((res) => {
          this.modelCars = res.data.results;
          return res.data.results;
        });
    },
    loadManufacturerById(id: number) {
      axiosInstance
        .get(`/api/car/manufacturers/${id}&page_size=1000`)
        .then((res) => {
          this.manufacturer = res.data;
        });
    },
  },
});
