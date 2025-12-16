/**
 * Modification API
 * API функции для работы с модификациями автомобилей
 *
 * МИГРИРУЕТ: src/stores/modifications-store.ts
 */

import { httpClient } from '@shared/api/base/http-client'
import { ENDPOINTS } from '@shared/api/base/api-config'
import { buildQueryString } from '@shared/api/lib/query-builder'
import type { Modification, ModificationFilters } from '../model/modification-types'
import type { PaginatedResponse } from '@shared/api/base/api-types'

/**
 * API клиент для работы с модификациями
 */
export const modificationApi = {
  /**
   * Получить список модификаций с фильтрацией
   */
  async getList(filters: ModificationFilters = {}): Promise<PaginatedResponse<Modification>> {
    const queryString = buildQueryString(filters)
    const { data } = await httpClient.get<PaginatedResponse<Modification>>(
      `${ENDPOINTS.MODIFICATIONS.LIST}${queryString}`
    )
    return data
  },

  /**
   * Получить модификации по модели автомобиля
   */
  async getByModelCar(modelCarId: number): Promise<PaginatedResponse<Modification>> {
    const { data } = await httpClient.get<PaginatedResponse<Modification>>(
      `${ENDPOINTS.MODIFICATIONS.LIST}?modelCar=${modelCarId}`
    )
    return data
  },

  /**
   * Получить одну модификацию по ID
   */
  async getById(id: number): Promise<Modification> {
    const { data } = await httpClient.get<Modification>(
      `${ENDPOINTS.MODIFICATIONS.LIST}${id}/`
    )
    return data
  },

  /**
   * Создать модификацию
   */
  async create(modification: Partial<Modification>): Promise<Modification> {
    const { data } = await httpClient.post<Modification>(
      ENDPOINTS.MODIFICATIONS.LIST,
      modification
    )
    return data
  },

  /**
   * Обновить модификацию
   */
  async update(id: number, modification: Partial<Modification>): Promise<Modification> {
    const { data } = await httpClient.patch<Modification>(
      `${ENDPOINTS.MODIFICATIONS.LIST}${id}/`,
      modification
    )
    return data
  },

  /**
   * Удалить модификацию
   */
  async delete(id: number): Promise<void> {
    await httpClient.delete(`${ENDPOINTS.MODIFICATIONS.LIST}${id}/`)
  }
}
