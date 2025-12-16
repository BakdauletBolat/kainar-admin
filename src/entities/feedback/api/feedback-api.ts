/**
 * Feedback API
 * API функции для работы с заявками
 *
 * МИГРИРУЕТ: Методы из src/stores/feedback-store.ts
 */

import { httpClient } from '@shared/api/base/http-client'
import { ENDPOINTS } from '@shared/api/base/api-config'
import { buildQueryString } from '@shared/api/lib/query-builder'
import type { Feedback, FeedbackFilters } from '../model/feedback-types'
import type { PaginatedResponse } from '@shared/api/base/api-types'

/**
 * API клиент для работы с заявками
 */
export const feedbackApi = {
  /**
   * Получить список заявок с фильтрацией
   */
  async getList(filters: FeedbackFilters = {}): Promise<PaginatedResponse<Feedback>> {
    const queryString = buildQueryString(filters)
    const { data } = await httpClient.get<PaginatedResponse<Feedback>>(
      `${ENDPOINTS.FEEDBACKS.LIST}${queryString}`
    )
    return data
  },

  /**
   * Закрыть заявку (отметить как выполненную)
   */
  async close(id: number): Promise<Feedback> {
    const { data } = await httpClient.patch<Feedback>(
      `${ENDPOINTS.FEEDBACKS.LIST}${id}/`,
      {
        completed_at: new Date().toISOString()
      }
    )
    return data
  },

  /**
   * Получить одну заявку по ID
   */
  async getById(id: number): Promise<Feedback> {
    const { data } = await httpClient.get<Feedback>(
      `${ENDPOINTS.FEEDBACKS.LIST}${id}/`
    )
    return data
  },

  /**
   * Удалить заявку
   */
  async delete(id: number): Promise<void> {
    await httpClient.delete(`${ENDPOINTS.FEEDBACKS.LIST}${id}/`)
  }
}
