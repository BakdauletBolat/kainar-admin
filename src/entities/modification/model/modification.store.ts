import { defineStore } from 'pinia';
import { getModifications, getModification } from '../api/modification.api';
import type { Modification } from './types';

export const useModificationStore = defineStore('modification', {
  state: () => {
    return {
      modifications: [] as Modification[],
      modification: null as Modification | null,
      isLoading: false as boolean,
    };
  },
  actions: {
    async loadModifications(modelCar: number) {
      this.isLoading = true;
      return getModifications(modelCar)
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
      return getModification(modificationId)
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
