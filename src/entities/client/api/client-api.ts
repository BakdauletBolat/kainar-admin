/**
 * Client API
 * API функции для работы с клиентами
 *
 * МИГРИРУЕТ: Методы из src/stores/client-store.ts
 */

import { httpClient } from '@shared/api/base/http-client'
import { ENDPOINTS } from '@shared/api/base/api-config'
import { buildQueryString } from '@shared/api/lib/query-builder'
import type { Client, ClientFilters } from '../model/client-types'
import type { PaginatedResponse } from '@shared/api/base/api-types'

/**
 * API клиент для работы с клиентами
 */
export const clientApi = {
  /**
   * Получить список клиентов с фильтрацией
   */
  async getList(filters: ClientFilters = {}): Promise<PaginatedResponse<Client>> {
    // Добавить сортировку по умолчанию как в старом коде
    const filtersWithSort = {
      ...filters,
      sort: filters.sort || '-id'
    }

    const queryString = buildQueryString(filtersWithSort)
    const { data } = await httpClient.get<PaginatedResponse<Client>>(
      `${ENDPOINTS.CLIENTS.LIST}${queryString}`
    )
    return data
  },

  /**
   * Получить одного клиента по ID
   */
  async getById(id: number | string): Promise<Client> {
    const { data } = await httpClient.get<Client>(ENDPOINTS.CLIENTS.DETAIL(id))
    return data
  },

  /**
   * Обновить клиента
   */
  async update(id: number | string, client: Partial<Client>): Promise<Client> {
    const { data } = await httpClient.patch<Client>(
      ENDPOINTS.CLIENTS.DETAIL(id),
      client
    )
    return data
  },

  /**
   * Создать клиента
   */
  async create(client: Partial<Client>): Promise<Client> {
    const { data } = await httpClient.post<Client>(
      ENDPOINTS.CLIENTS.LIST,
      client
    )
    return data
  },

  /**
   * Удалить клиента
   */
  async delete(id: number | string): Promise<void> {
    await httpClient.delete(ENDPOINTS.CLIENTS.DETAIL(id))
  }
}
