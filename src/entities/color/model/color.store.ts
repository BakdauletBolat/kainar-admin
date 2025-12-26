import { defineStore } from 'pinia';
import { getColors } from '../api/color.api';
import type { Color } from './types';

export const useColorStore = defineStore('color', {
  state: () => {
    return {
      colors: [] as Color[],
    };
  },
  getters: {
    colorOptions: (state) => {
      return state.colors.map((item: any) => {
        return { label: item.name, value: item.id };
      });
    },
  },
  actions: {
    async loadColors() {
      return getColors().then((res) => {
        this.colors = res.data.results;
        return res.data.results;
      });
    },
  },
});
