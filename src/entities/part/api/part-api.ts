/**
 * Part API
 * API функции для работы с запчастями
 *
 * МИГРИРУЕТ: src/apis/products.ts
 */

import { httpClient } from '@shared/api/base/http-client'
import { ENDPOINTS } from '@shared/api/base/api-config'
import { buildQueryString } from '@shared/api/lib/query-builder'
import type { Part, PartFilters, PartListItem } from '../model/part-types'
import type { PaginatedResponse } from '@shared/api/base/api-types'

/**
 * API клиент для работы с запчастями
 */
export const partApi = {
  /**
   * Получить список запчастей с фильтрацией
   */
  async getList(filters: PartFilters = {}): Promise<PaginatedResponse<PartListItem>> {
    const queryString = buildQueryString(filters)
    const { data } = await httpClient.get<PaginatedResponse<PartListItem>>(
      `${ENDPOINTS.PARTS.LIST}${queryString}`
    )
    return data
  },

  /**
   * Получить одну запчасть по ID
   */
  async getById(id: string | number): Promise<Part> {
    const { data } = await httpClient.get<Part>(ENDPOINTS.PARTS.DETAIL(id))
    return data
  },

  /**
   * Массовое удаление запчастей
   */
  async bulkDelete(ids: number[]): Promise<void> {
    await httpClient.delete(ENDPOINTS.PARTS.BULK_DELETE, {
      data: { ids }
    })
  },

  /**
   * Создать запчасть
   * TODO: Добавить эндпоинт в ENDPOINTS когда потребуется
   */
  async create(part: Partial<Part>): Promise<Part> {
    const { data } = await httpClient.post<Part>(ENDPOINTS.PARTS.LIST, part)
    return data
  },

  /**
   * Обновить запчасть
   * TODO: Добавить эндпоинт в ENDPOINTS когда потребуется
   */
  async update(id: number, part: Partial<Part>): Promise<Part> {
    const { data } = await httpClient.patch<Part>(
      ENDPOINTS.PARTS.DETAIL(id),
      part
    )
    return data
  },

  /**
   * Загрузить изображения для запчасти
   * TODO: Добавить эндпоинт в ENDPOINTS когда потребуется
   */
  async uploadImages(id: number, images: File[]): Promise<void> {
    const formData = new FormData()
    images.forEach(img => formData.append('images', img))

    await httpClient.post(`/api/admin/product/v2/${id}/images/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
