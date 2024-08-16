import { ICarFiltersData, ICarModelType, IManufacturerType } from "@/stores/models";
import axiosIns from "."

export const getCarFilters = () => {
    return axiosIns.get<ICarFiltersData>('/api/car/filters/');
}

export const getCarManufacturers = () => {
    return axiosIns.get<{
        results: IManufacturerType[]
    }>('/api/car/manufacturers/');
}

export const getModelCars = (manufacturerId: number) => {
    return axiosIns.get<{
        results: ICarModelType[]
    }>(`/api/car/models/?manufacturer=${manufacturerId}`);
}