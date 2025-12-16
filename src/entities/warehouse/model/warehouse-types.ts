/**
 * Warehouse Entity Types
 * МИГРИРУЕТ: src/stores/warehouses-store.ts (interfaces)
 */

/**
 * Город
 */
export interface City {
  id: number
  name: string
  uid?: string | null
  country?: number
}

/**
 * Склад
 */
export interface Warehouse {
  id: number | string
  name: string
  minStockLevel: number
  city: City
  categories: number[]
  createdAt?: string
  updatedAt?: string
}

/**
 * Упрощенная версия для списка
 */
export interface WarehouseListItem {
  id: number | string
  name: string
  minStockLevel: number
  city: {
    id: number
    name: string
  }
  categories: Array<{
    id: number
    name: string
  }>
}

/**
 * Опция для select
 */
export interface WarehouseOption {
  label: string
  value: number | string
}

/**
 * Фильтры для складов
 */
export interface WarehouseFilters {
  search?: string
  city?: number
  limit?: number
  offset?: number
  page?: number
  pageSize?: number
}
