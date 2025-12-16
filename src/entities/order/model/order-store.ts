/**
 * Order Store
 * State management для заказов
 *
 * МИГРИРУЕТ: src/stores/order-store.ts
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { orderApi } from '../api/order-api'
import type { Order, OrderFilters, CreateOrderData, RefundOrderData } from './order-types'

export const useOrderStore = defineStore('order', () => {
  // ================ STATE ================

  /**
   * Список всех заказов
   */
  const orders = ref<Order[]>([])

  /**
   * Заказы в процессе
   */
  const ordersInProgress = ref<Order[]>([])

  /**
   * Текущий заказ
   */
  const order = ref<Order | null>(null)

  /**
   * Флаги загрузки
   */
  const isLoadingOrders = ref(false)
  const isLoadingOrdersInProgress = ref(false)
  const isLoadingCreate = ref(false)
  const isLoadingRefund = ref(false)
  const isLoadingConfirmPayment = ref(false)
  const isLoadingConfirm = ref(false)
  const isLoadingCancel = ref(false)

  // ================ GETTERS ================

  /**
   * Названия товаров в текущем заказе
   */
  const orderName = computed(() => {
    if (!order.value) return ''
    return order.value.goods.map(good => good.product.name).join(', ')
  })

  /**
   * Проверка наличия заказов
   */
  const hasOrders = computed(() => {
    return orders.value.length > 0
  })

  // ================ ACTIONS ================

  /**
   * Загрузить список заказов
   */
  async function loadOrders(filters: OrderFilters = {}) {
    isLoadingOrders.value = true

    try {
      const response = await orderApi.getList(filters)
      orders.value = response.results
      return response
    } catch (error) {
      console.error('Failed to load orders:', error)
      throw error
    } finally {
      isLoadingOrders.value = false
    }
  }

  /**
   * Загрузить заказы в процессе
   */
  async function loadOrdersInProgress(filters: OrderFilters = {}) {
    isLoadingOrdersInProgress.value = true

    try {
      const response = await orderApi.getList(filters)
      ordersInProgress.value = response.results
      return response
    } catch (error) {
      console.error('Failed to load orders in progress:', error)
      throw error
    } finally {
      isLoadingOrdersInProgress.value = false
    }
  }

  /**
   * Загрузить один заказ по ID
   */
  async function loadOrder(id: number | string) {
    isLoadingOrders.value = true

    try {
      const ord = await orderApi.getById(id)
      order.value = ord
      return ord
    } catch (error) {
      console.error('Failed to load order:', error)
      throw error
    } finally {
      isLoadingOrders.value = false
    }
  }

  /**
   * Создать заказ
   */
  async function createOrder(orderData: CreateOrderData) {
    isLoadingCreate.value = true

    try {
      const newOrder = await orderApi.create(orderData)
      return newOrder
    } catch (error) {
      console.error('Failed to create order:', error)
      throw error
    } finally {
      isLoadingCreate.value = false
    }
  }

  /**
   * Подтвердить заказ
   */
  async function confirmOrder() {
    if (!order.value) {
      throw new Error('No order selected')
    }

    isLoadingConfirm.value = true

    try {
      await orderApi.confirm(order.value.id)
      // Перезагрузить текущий заказ
      await loadOrder(order.value.id)
    } catch (error) {
      console.error('Failed to confirm order:', error)
      throw error
    } finally {
      isLoadingConfirm.value = false
    }
  }

  /**
   * Отменить заказ
   */
  async function cancelOrder() {
    if (!order.value) {
      throw new Error('No order selected')
    }

    isLoadingCancel.value = true

    try {
      await orderApi.cancel(order.value.id)
      // Перезагрузить текущий заказ
      await loadOrder(order.value.id)
    } catch (error) {
      console.error('Failed to cancel order:', error)
      throw error
    } finally {
      isLoadingCancel.value = false
    }
  }

  /**
   * Подтвердить оплату
   */
  async function confirmPaymentOrder() {
    if (!order.value) {
      throw new Error('No order selected')
    }

    isLoadingConfirmPayment.value = true

    try {
      await orderApi.confirmPayment(order.value.id)
      // Перезагрузить текущий заказ
      await loadOrder(order.value.id)
    } catch (error) {
      console.error('Failed to confirm payment:', error)
      throw error
    } finally {
      isLoadingConfirmPayment.value = false
    }
  }

  /**
   * Возврат заказа
   */
  async function refundOrder(comment: string) {
    if (!order.value) {
      throw new Error('No order selected')
    }

    isLoadingRefund.value = true

    const refundData: RefundOrderData = {
      comment,
      warehouse_id: order.value.warehouse.id,
      refund_order_id: order.value.id,
      goods: order.value.goods.map(good => ({
        product_id: good.product.id,
        quantity: good.quantity,
        quality_id: 1
      }))
    }

    try {
      await orderApi.refund(refundData)
      // Перезагрузить текущий заказ
      await loadOrder(order.value.id)
    } catch (error) {
      console.error('Failed to refund order:', error)
      throw error
    } finally {
      isLoadingRefund.value = false
    }
  }

  /**
   * Сбросить state
   */
  function resetState() {
    orders.value = []
    ordersInProgress.value = []
    order.value = null
    isLoadingOrders.value = false
    isLoadingOrdersInProgress.value = false
    isLoadingCreate.value = false
    isLoadingRefund.value = false
    isLoadingConfirmPayment.value = false
    isLoadingConfirm.value = false
    isLoadingCancel.value = false
  }

  // ================ RETURN ================

  return {
    // State
    orders,
    ordersInProgress,
    order,
    isLoadingOrders,
    isLoadingOrdersInProgress,
    isLoadingCreate,
    isLoadingRefund,
    isLoadingConfirmPayment,
    isLoadingConfirm,
    isLoadingCancel,

    // Getters
    orderName,
    hasOrders,

    // Actions
    loadOrders,
    loadOrdersInProgress,
    loadOrder,
    createOrder,
    confirmOrder,
    cancelOrder,
    confirmPaymentOrder,
    refundOrder,
    resetState
  }
})
