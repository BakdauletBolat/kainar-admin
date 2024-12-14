import { defineStore } from "pinia";
import axiosInstance from "@/apis";


export const useColorStore = defineStore("color-store", {
  state: () => {
    return {
        colors: []
    };
  },
    getters: {
    colorOptions: state => {
        return state.colors.map((item:any)=>{
            return {label: item.name, value: item.id}
        })
    }
    },
  actions: {
    async loadColors() {
      return axiosInstance
        .get(`/api/admin/car/color/`)
        .then((res) => {
          this.colors = res.data.results;
          return res.data.results;
        });
    }
  },
});
