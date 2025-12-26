import axiosInstance from '@/shared/api/axios';
import generateQuery from '@/shared/lib/generateQuery';
import type { Client } from '../model/types';

export async function getClients(options: any) {
  options.sort = '-id';
  const query = generateQuery(options);
  return await axiosInstance.get<{
    results: Client[];
    count: number;
  }>(`/api/admin/users/${query}`);
}

export async function getClient(id: number | string) {
  return await axiosInstance.get<Client>(`/api/users/${id}/`);
}

export async function patchClient(id: number | string, data: any) {
  return await axiosInstance.patch<Client>(`/api/users/${id}/`, data);
}
