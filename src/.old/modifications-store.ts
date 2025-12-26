import { defineStore } from "pinia";
import axiosInstance from "@/shared/api/axios";
import type { IDefaultAPI } from "@/apis/interfaces";

interface Manufacturer {
    id: number;
    name: string;
    image: string | null;
}

interface ModelCar {
    id: number;
    manufacturer: Manufacturer;
    name: string;
    startDate?: string;
}

export interface IModification {
    axleConfiguration: null;
    image: string | null;
    bodyType: string;
    capacity: number;
    driveType: string;
    engineDisplacement: null;
    engines: any[]; // You can specify the engine type if known
    fuelType: string;
    gearType: null;
    id: number;
    modelCar: ModelCar;
    name: string;
    numberOfCycle: number;
    numberOfValves: number;
    power: number;
    steeringType: null;
    vinCode: number;
}


export const useModificationsStore = defineStore("modifications-store", {
  state: () => {
    return {
      modifications: [] as IModification[],
      modification: null as unknown as IModification,
      searchManufacturers: [] as IDefaultAPI[],
      isLoading: false as boolean,
      isLoadingModelCarList: false as boolean,
    };
  },
  actions: {
    async loadModifications(modelCar: number) {
      this.isLoading = true;
      return axiosInstance
        .get(`/api/admin/car/modifications/?modelCar=${modelCar}&page_size=1000`)
        .then((res) => {
          this.modifications = res.data.results;
          return res.data.results;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async loadModification(modificationId: number) {
      this.isLoading = true;
      return axiosInstance
          .get(`/api/admin/car/modifications/${modificationId}/`)
          .then((res) => {
            this.modification = res.data;
            return res.data;
          })
          .finally(() => {
            this.isLoading = false;
          });
    },
  },
});
