/**
 * Order API
 * API функции для работы с заказами
 *
 * МИГРИРУЕТ: src/apis/orders.ts, src/stores/order-store.ts
 */

import { httpClient } from '@shared/api/base/http-client'
import { ENDPOINTS } from '@shared/api/base/api-config'
import { buildQueryString } from '@shared/api/lib/query-builder'
import type { Order, OrderFilters, CreateOrderData, RefundOrderData } from '../model/order-types'
import type { PaginatedResponse } from '@shared/api/base/api-types'

/**
 * API клиент для работы с заказами
 */
export const orderApi = {
  /**
   * Получить список заказов с фильтрацией
   */
  async getList(filters: OrderFilters = {}): Promise<PaginatedResponse<Order>> {
    const queryString = buildQueryString(filters)
    const { data } = await httpClient.get<PaginatedResponse<Order>>(
      `${ENDPOINTS.ORDERS.LIST}${queryString}`
    )
    return data
  },

  /**
   * Получить один заказ по ID
   */
  async getById(id: number | string): Promise<Order> {
    const { data } = await httpClient.get<Order>(ENDPOINTS.ORDERS.DETAIL(id))
    return data
  },

  /**
   * Создать заказ
   */
  async create(orderData: CreateOrderData): Promise<Order> {
    const { data } = await httpClient.post<Order>(
      ENDPOINTS.ORDERS.LIST,
      orderData
    )
    return data
  },

  /**
   * Подтвердить заказ
   */
  async confirm(id: number | string): Promise<Order> {
    const { data } = await httpClient.post<Order>(
      ENDPOINTS.ORDERS.CONFIRM(id)
    )
    return data
  },

  /**
   * Отменить заказ
   */
  async cancel(id: number | string): Promise<void> {
    await httpClient.delete(ENDPOINTS.ORDERS.DETAIL(id))
  },

  /**
   * Подтвердить оплату заказа
   */
  async confirmPayment(id: number | string): Promise<Order> {
    const { data } = await httpClient.patch<Order>(
      ENDPOINTS.ORDERS.DETAIL(id),
      { payment_status: 2 }
    )
    return data
  },

  /**
   * Возврат заказа
   */
  async refund(refundData: RefundOrderData): Promise<any> {
    const { data } = await httpClient.post(
      ENDPOINTS.ORDERS.REFUND,
      refundData
    )
    return data
  },

  /**
   * Обновить заказ
   */
  async update(id: number | string, orderData: Partial<Order>): Promise<Order> {
    const { data } = await httpClient.patch<Order>(
      ENDPOINTS.ORDERS.DETAIL(id),
      orderData
    )
    return data
  }
}
