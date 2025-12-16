/**
 * Manufacturer API
 * API функции для работы с производителями
 *
 * МИГРИРУЕТ: Методы из src/stores/manufacturer-store.ts
 */

import { httpClient } from '@shared/api/base/http-client'
import { ENDPOINTS } from '@shared/api/base/api-config'
import type { Manufacturer } from '../model/manufacturer-types'
import type { PaginatedResponse } from '@shared/api/base/api-types'

/**
 * API клиент для работы с производителями
 */
export const manufacturerApi = {
  /**
   * Получить список производителей
   */
  async getList(): Promise<PaginatedResponse<Manufacturer>> {
    const { data } = await httpClient.get<PaginatedResponse<Manufacturer>>(
      ENDPOINTS.MANUFACTURERS.LIST
    )
    return data
  },

  /**
   * Получить одного производителя по ID
   */
  async getById(id: number): Promise<Manufacturer> {
    const { data } = await httpClient.get<Manufacturer>(
      `${ENDPOINTS.MANUFACTURERS.LIST}${id}/`
    )
    return data
  },

  /**
   * Создать производителя
   */
  async create(manufacturer: Partial<Manufacturer>): Promise<Manufacturer> {
    const { data } = await httpClient.post<Manufacturer>(
      ENDPOINTS.MANUFACTURERS.LIST,
      manufacturer
    )
    return data
  },

  /**
   * Обновить производителя
   */
  async update(id: number, manufacturer: Partial<Manufacturer>): Promise<Manufacturer> {
    const { data } = await httpClient.patch<Manufacturer>(
      `${ENDPOINTS.MANUFACTURERS.LIST}${id}/`,
      manufacturer
    )
    return data
  },

  /**
   * Удалить производителя
   */
  async delete(id: number): Promise<void> {
    await httpClient.delete(`${ENDPOINTS.MANUFACTURERS.LIST}${id}/`)
  }
}
