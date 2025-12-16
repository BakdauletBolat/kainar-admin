/**
 * Warehouse API
 * API функции для работы со складами
 *
 * МИГРИРУЕТ: Функции из src/stores/warehouses-store.ts
 */

import { httpClient } from '@shared/api/base/http-client'
import { ENDPOINTS } from '@shared/api/base/api-config'
import { buildQueryString } from '@shared/api/lib/query-builder'
import type { Warehouse, WarehouseListItem, WarehouseFilters } from '../model/warehouse-types'
import type { PaginatedResponse } from '@shared/api/base/api-types'

/**
 * API клиент для работы со складами
 */
export const warehouseApi = {
  /**
   * Получить список складов с фильтрацией
   */
  async getList(filters: WarehouseFilters = {}): Promise<PaginatedResponse<WarehouseListItem>> {
    const queryString = buildQueryString(filters)
    const { data } = await httpClient.get<PaginatedResponse<WarehouseListItem>>(
      `${ENDPOINTS.WAREHOUSES.LIST}${queryString}`
    )
    return data
  },

  /**
   * Получить один склад по ID
   */
  async getById(id: number | string): Promise<Warehouse> {
    const { data } = await httpClient.get<Warehouse>(ENDPOINTS.WAREHOUSES.DETAIL(id))
    return data
  },

  /**
   * Создать склад
   */
  async create(warehouse: Partial<Warehouse>): Promise<Warehouse> {
    const { data } = await httpClient.post<Warehouse>(
      ENDPOINTS.WAREHOUSES.LIST,
      warehouse
    )
    return data
  },

  /**
   * Обновить склад
   */
  async update(id: number | string, warehouse: Partial<Warehouse>): Promise<Warehouse> {
    const { data } = await httpClient.patch<Warehouse>(
      ENDPOINTS.WAREHOUSES.DETAIL(id),
      warehouse
    )
    return data
  },

  /**
   * Удалить склад
   */
  async delete(id: number | string): Promise<void> {
    await httpClient.delete(ENDPOINTS.WAREHOUSES.DETAIL(id))
  }
}
