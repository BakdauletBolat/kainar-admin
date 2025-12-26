import axiosInstance from '@/shared/api/axios';
import type { Modification } from '../model/types';

export async function getModifications(modelCar: number) {
  return await axiosInstance.get<{
    results: Modification[];
  }>(`/api/admin/car/modifications/?modelCar=${modelCar}&page_size=1000`);
}

export async function getModification(modificationId: number) {
  return await axiosInstance.get<Modification>(`/api/admin/car/modifications/${modificationId}/`);
}
