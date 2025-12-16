/**
 * Order Entity Types
 * МИГРИРУЕТ: src/apis/domain/order.ts, src/stores/order-store.ts
 */

/**
 * Товар в заказе
 */
export interface OrderGood {
  id: number
  product: {
    id: number
    name: string
    price?: number
    category: {
      id: number
      name: string
    }
    pictures: Array<{
      id: number
      image: string
      product: number
    }>
  }
  quantity: number
}

/**
 * Заказ
 */
export interface Order {
  id: number
  uuid: string
  orderNumber?: string // Номер заказа
  goods: OrderGood[]
  total: string
  totalAmount?: number // Общая сумма (для совместимости)
  deliveryType: string
  paymentType: string
  paymentStatus: string
  payment_status?: string // snake_case для совместимости
  status: string
  warehouse: {
    id: number
    name: string
    city: {
      id: number
      name: string
    }
  }
  createdAt: string
  updatedAt: string
  comment: string
  discount: number
  client: string | {
    firstName?: string
    lastName?: string
    name?: string
  }
  firstName: string
  lastName?: string | null
  phoneNumber: string
  email: string
  address?: string | null
}

/**
 * Данные для создания заказа
 */
export interface CreateOrderData {
  goods: Array<{
    product_id: number
    quality_id: number
    quantity: number
  }>
  delivery_type_id: number
  payment_type_id: number
  warehouse_id: number
  comment: string
  discount: number
  first_name: string
  phone_number: string
  email: string
}

/**
 * Данные для возврата заказа
 */
export interface RefundOrderData {
  comment: string
  warehouse_id: number
  refund_order_id: number
  goods: Array<{
    product_id: number
    quantity: number
    quality_id: number
  }>
}

/**
 * Фильтры для заказов
 */
export interface OrderFilters {
  status?: string
  paymentStatus?: string
  search?: string
  limit?: number
  offset?: number
  page?: number
  pageSize?: number
}

/**
 * DTO для создания заказа (упрощенный)
 */
export interface CreateOrderDto {
  client: number | null
  parts: number[]
  payment_method: string | null
  comment?: string
}
