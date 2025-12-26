import axiosInstance from '@/shared/api/axios';
import type { Category } from '../model/types';

export async function getCategories() {
  return await axiosInstance.get<{
    results: Category[];
  }>(`/api/admin/category?page_size=2000`);
}

export async function getCategoriesTree() {
  return await axiosInstance.get<Category[]>(`/api/admin/category/tree`);
}

export async function getCategoryById(id: number) {
  return await axiosInstance.get<Category>(`/api/admin/category/${id}`);
}
