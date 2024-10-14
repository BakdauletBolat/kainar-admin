import { defineStore } from "pinia";
import axiosInstance from "@/apis";
import type { IDefaultAPI } from "@/apis/interfaces";



export const useColorStore = defineStore("color-store", {
  state: () => {
    return {
        colors: []
    };
  },
    getters: {
    colorOptions: state => {
        return state.colors.map(item=>{
            return {label: item.name, value: item.id}
        })
    }
    },
  actions: {
    async loadColors(modelCar: number) {
      return axiosInstance
        .get(`/api/car/color/`)
        .then((res) => {
          this.colors = res.data.results;
          return res.data.results;
        });
    }
  },
});
