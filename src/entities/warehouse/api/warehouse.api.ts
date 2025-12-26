import axiosIns from '@/shared/api/axios';
import generateQuery from '@/shared/lib/generateQuery';
import type { WarehouseList } from '../model/types';

export async function getWarehouses(options: any) {
  const query = generateQuery(options);
  return await axiosIns.get<{
    results: WarehouseList[];
    count: number;
  }>(`/api/admin/stock/warehouses/${query}`);
}

export async function getWarehouse(id: number) {
  return await axiosIns.get<WarehouseList>(`/api/admin/stock/warehouses/${id}/`);
}

export async function deleteWarehouse(id: string) {
  return await axiosIns.delete(`/api/admin/stock/warehouses/${id}/`);
}
