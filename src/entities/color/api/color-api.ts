/**
 * Color API
 * API функции для работы с цветами
 *
 * МИГРИРУЕТ: Методы из src/stores/color-store.ts
 */

import { httpClient } from '@shared/api/base/http-client'
import { ENDPOINTS } from '@shared/api/base/api-config'
import type { Color } from '../model/color-types'
import type { PaginatedResponse } from '@shared/api/base/api-types'

/**
 * API клиент для работы с цветами
 */
export const colorApi = {
  /**
   * Получить список цветов
   */
  async getList(): Promise<PaginatedResponse<Color>> {
    const { data } = await httpClient.get<PaginatedResponse<Color>>(
      ENDPOINTS.COLORS.LIST
    )
    return data
  },

  /**
   * Создать цвет
   */
  async create(color: Partial<Color>): Promise<Color> {
    const { data } = await httpClient.post<Color>(ENDPOINTS.COLORS.LIST, color)
    return data
  },

  /**
   * Обновить цвет
   */
  async update(id: number, color: Partial<Color>): Promise<Color> {
    const { data } = await httpClient.patch<Color>(
      `${ENDPOINTS.COLORS.LIST}${id}/`,
      color
    )
    return data
  },

  /**
   * Удалить цвет
   */
  async delete(id: number): Promise<void> {
    await httpClient.delete(`${ENDPOINTS.COLORS.LIST}${id}/`)
  }
}
