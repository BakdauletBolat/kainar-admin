import axiosInstance from '@/shared/api/axios';
import type { CarFilterData } from '../model/types';

export async function getCarFilters() {
  return await axiosInstance.get<CarFilterData>('/api/admin/car/filters/');
}
