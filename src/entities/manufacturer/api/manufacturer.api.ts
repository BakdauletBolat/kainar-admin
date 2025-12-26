import axiosInstance from '@/shared/api/axios';
import type { Manufacturer, ModelCar } from '../model/types';

export async function getManufacturers() {
  return await axiosInstance.get<{
    results: Manufacturer[];
  }>('/api/admin/car/manufacturers/?page_size=1000');
}

export async function getModelCars(manufacturerId: number) {
  return await axiosInstance.get<{
    results: ModelCar[];
  }>(`/api/admin/car/models/?manufacturer=${manufacturerId}&page_size=1000`);
}

export async function getManufacturerById(id: number) {
  return await axiosInstance.get<Manufacturer>(`/api/car/admin/manufacturers/${id}&page_size=1000`);
}
