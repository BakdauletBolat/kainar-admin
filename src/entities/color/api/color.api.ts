import axiosInstance from '@/shared/api/axios';
import type { Color } from '../model/types';

export async function getColors() {
  return await axiosInstance.get<{
    results: Color[];
  }>(`/api/admin/car/color/`);
}
