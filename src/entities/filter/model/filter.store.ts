import { defineStore } from 'pinia';
import { getCarFilters } from '../api/filter.api';
import type { CarFilterData, FilterValues } from './types';

export const useFilterStore = defineStore('filter', {
  state: () => {
    return {
      filterValues: {
        search: null,
        category: null,
        modification: null,
        modelCar: null,
        manufacturer: null,
        axleConfiguration: null,
        bodyType: null,
        capacity: null,
        driveType: null,
        engineDisplacement: null,
        fuelType: null,
        gearType: null,
        numberOfCycle: null,
        numberOfValves: null,
        power: null,
        steeringType: null,
        vinCode: null,
        warehouse_id: null,
      } as FilterValues,
      filterData: {} as CarFilterData,
    };
  },
  actions: {
    loadFilters() {
      getCarFilters().then((res) => {
        this.filterData = res.data;
      });
    },
    clearValues() {
      this.filterValues = {
        search: null,
        category: null,
        modification: null,
        modelCar: null,
        manufacturer: null,
        axleConfiguration: null,
        bodyType: null,
        capacity: null,
        driveType: null,
        engineDisplacement: null,
        fuelType: null,
        gearType: null,
        numberOfCycle: null,
        numberOfValves: null,
        power: null,
        steeringType: null,
        warehouse_id: null,
        vinCode: null,
      };
    },
    resetFilters() {
      this.clearValues();
    },
  },
  getters: {
    filtersForm: (state) => {
      const filterForm: any[] = [];
      Object.keys(state.filterData).forEach((key) => {
        let type;
        let options;
        let title;
        switch (key) {
          case 'axleConfiguration':
            type = 'radio';
            options = state.filterData[key].map((item) => {
              return { label: item.name, value: item.name };
            });
            title = 'Конфигурация оси';
            break;
          case 'bodyType':
            type = 'radio';
            options = state.filterData[key].map((item) => {
              return { label: item.name, value: item.name };
            });
            title = 'Тип кузова';
            break;
          case 'capacity':
            type = 'select';
            options = state.filterData[key].map((item) => {
              return { label: item, value: item };
            });
            title = 'Eмкость';
            break;
          case 'driveType':
            type = 'radio';
            options = state.filterData[key].map((item) => {
              return { label: item.name, value: item.name };
            });
            title = 'Тип диска';
            break;
          case 'engineDisplacement':
            type = 'select';
            options = state.filterData[key].map((item) => {
              return { label: item, value: item };
            });
            title = 'Объем двигателя';
            break;
          case 'fuelType':
            type = 'radio';
            options = state.filterData[key].map((item) => {
              return { label: item.name, value: item.name };
            });
            title = 'Тип топлива';
            break;
          case 'gearType':
            type = 'radio';
            options = state.filterData[key].map((item) => {
              return { label: item.name, value: item.name };
            });
            title = 'Тип шестерни';
            break;
          case 'numberOfCycle':
            type = 'select';
            options = state.filterData[key].map((item) => {
              return { label: item, value: item };
            });
            title = 'Количество циклов';
            break;
          case 'numberOfValves':
            type = 'select';
            options = state.filterData[key].map((item) => {
              return { label: item, value: item };
            });
            title = 'Количество клапанов';
            break;
          case 'power':
            type = 'select';
            options = state.filterData[key].map((item) => {
              return { label: item, value: item };
            });
            title = 'Мощность';
            break;
          case 'steeringType':
            type = 'radio';
            options = state.filterData[key].map((item) => {
              return { label: item.name, value: item.name };
            });
            title = 'Тип рулевого управления';
            break;
          case 'vinCode':
            type = 'select';
            options = state.filterData[key].map((item) => {
              return { label: item, value: item };
            });
            title = 'Винкод';
            break;
        }
        filterForm.push({
          type,
          title,
          options,
          key,
        });
      });
      return filterForm;
    },
  },
});
