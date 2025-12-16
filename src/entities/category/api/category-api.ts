/**
 * Category API
 * API функции для работы с категориями
 *
 * МИГРИРУЕТ: Методы из src/stores/category-storage.ts
 */

import { httpClient } from '@shared/api/base/http-client'
import { ENDPOINTS } from '@shared/api/base/api-config'
import { buildQueryString } from '@shared/api/lib/query-builder'
import type { Category, CategoryTree, CategoryFilters } from '../model/category-types'
import type { PaginatedResponse } from '@shared/api/base/api-types'

/**
 * API клиент для работы с категориями
 */
export const categoryApi = {
  /**
   * Получить список категорий с пагинацией
   */
  async getList(filters: CategoryFilters = {}): Promise<PaginatedResponse<Category>> {
    const queryString = buildQueryString(filters)
    const { data } = await httpClient.get<PaginatedResponse<Category>>(
      `${ENDPOINTS.CATEGORIES.LIST}${queryString}`
    )
    return data
  },

  /**
   * Получить одну категорию по ID
   */
  async getById(id: number): Promise<Category> {
    const { data } = await httpClient.get<Category>(ENDPOINTS.CATEGORIES.DETAIL(id))
    return data
  },

  /**
   * Получить дерево категорий
   */
  async getTree(): Promise<CategoryTree[]> {
    const { data } = await httpClient.get<CategoryTree[]>(ENDPOINTS.CATEGORIES.TREE)
    return data
  },

  /**
   * Создать категорию
   */
  async create(category: Partial<Category>): Promise<Category> {
    const { data } = await httpClient.post<Category>(ENDPOINTS.CATEGORIES.LIST, category)
    return data
  },

  /**
   * Обновить категорию
   */
  async update(id: number, category: Partial<Category>): Promise<Category> {
    const { data } = await httpClient.patch<Category>(
      ENDPOINTS.CATEGORIES.DETAIL(id),
      category
    )
    return data
  },

  /**
   * Удалить категорию
   */
  async delete(id: number): Promise<void> {
    await httpClient.delete(ENDPOINTS.CATEGORIES.DETAIL(id))
  }
}
