/**
 * ModelCar API
 * API функции для работы с моделями автомобилей
 *
 * МИГРИРУЕТ: loadModelCars из src/stores/manufacturer-store.ts
 */

import { httpClient } from '@shared/api/base/http-client'
import { ENDPOINTS } from '@shared/api/base/api-config'
import { buildQueryString } from '@shared/api/lib/query-builder'
import type { ModelCar, ModelCarFilters } from '../model/model-car-types'
import type { PaginatedResponse } from '@shared/api/base/api-types'

/**
 * API клиент для работы с моделями автомобилей
 */
export const modelCarApi = {
  /**
   * Получить список моделей с фильтрацией
   */
  async getList(filters: ModelCarFilters = {}): Promise<PaginatedResponse<ModelCar>> {
    const queryString = buildQueryString(filters)
    const { data } = await httpClient.get<PaginatedResponse<ModelCar>>(
      `${ENDPOINTS.MANUFACTURERS.MODELS}${queryString}`
    )
    return data
  },

  /**
   * Получить модели по производителю
   */
  async getByManufacturer(manufacturerId: number, pageSize = 1000): Promise<PaginatedResponse<ModelCar>> {
    const { data } = await httpClient.get<PaginatedResponse<ModelCar>>(
      `${ENDPOINTS.MANUFACTURERS.MODELS}?manufacturer=${manufacturerId}&page_size=${pageSize}`
    )
    return data
  },

  /**
   * Получить одну модель по ID
   */
  async getById(id: number): Promise<ModelCar> {
    const { data } = await httpClient.get<ModelCar>(
      `${ENDPOINTS.MANUFACTURERS.MODELS}${id}/`
    )
    return data
  },

  /**
   * Создать модель
   */
  async create(modelCar: Partial<ModelCar>): Promise<ModelCar> {
    const { data } = await httpClient.post<ModelCar>(
      ENDPOINTS.MANUFACTURERS.MODELS,
      modelCar
    )
    return data
  },

  /**
   * Обновить модель
   */
  async update(id: number, modelCar: Partial<ModelCar>): Promise<ModelCar> {
    const { data } = await httpClient.patch<ModelCar>(
      `${ENDPOINTS.MANUFACTURERS.MODELS}${id}/`,
      modelCar
    )
    return data
  },

  /**
   * Удалить модель
   */
  async delete(id: number): Promise<void> {
    await httpClient.delete(`${ENDPOINTS.MANUFACTURERS.MODELS}${id}/`)
  }
}
