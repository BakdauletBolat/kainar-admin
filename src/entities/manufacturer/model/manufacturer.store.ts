import { defineStore } from 'pinia';
import { getManufacturers, getModelCars, getManufacturerById } from '../api/manufacturer.api';
import type { Manufacturer, ModelCar } from './types';

export const useManufacturerStore = defineStore('manufacturer', {
  state: () => {
    return {
      manufacturers: [] as Manufacturer[],
      searchManufacturers: [] as Manufacturer[],
      manufacturer: null as Manufacturer | null,
      modelCars: [] as ModelCar[],
      searchModelCars: [] as ModelCar[],
      isLoading: false as boolean,
      isLoadingModelCarList: false as boolean,
    };
  },
  getters: {
    manufacturersByLetterGrouping: (state) => {
      return state.manufacturers.reduce((accumulator, currentItem) => {
        const firstLetter = currentItem.name[0].toUpperCase();
        if (!accumulator[firstLetter]) {
          accumulator[firstLetter] = [];
        }
        accumulator[firstLetter].push(currentItem);
        return accumulator;
      }, {} as Record<string, Manufacturer[]>);
    },
    manufacturerOptions: (state) => {
      return state.manufacturers.map((option) => {
        return {
          label: option.name,
          value: option.id,
        };
      });
    },
    modelCarOptions: (state) => {
      return state.modelCars.map((option) => {
        return {
          label: option.name,
          value: option.id,
        };
      });
    },
  },
  actions: {
    async loadManufacturers() {
      this.isLoading = true;
      return getManufacturers()
        .then((res) => {
          this.manufacturers = res.data.results;
          return res.data.results;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async loadModelCars(manufacturerId: number) {
      this.isLoading = true;
      return getModelCars(manufacturerId)
        .then((res) => {
          this.modelCars = res.data.results;
          return res.data.results;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    loadManufacturerById(id: number) {
      getManufacturerById(id).then((res) => {
        this.manufacturer = res.data;
      });
    },
  },
});
