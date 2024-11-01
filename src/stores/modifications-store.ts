import { defineStore } from "pinia";
import axiosInstance from "@/apis";
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
    async loadModification(modificationId: number) {
      return axiosInstance
          .get(`/api/car/modifications/${modificationId}/`)
          .then((res) => {
            this.modification = res.data;
            return res.data;
          });
    },
  },
});
