/**
 * ModelCar Entity Types
 * МИГРИРУЕТ: src/stores/manufacturer-store.ts (modelCars), src/stores/modifications-store.ts (ModelCar)
 */

import type { Manufacturer } from '@entities/manufacturer'

/**
 * Модель автомобиля
 */
export interface ModelCar {
  id: number
  name: string
  manufacturer: Manufacturer | number
  startDate?: string
  endDate?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Опция для select
 */
export interface ModelCarOption {
  label: string
  value: number
}

/**
 * Фильтры для моделей
 */
export interface ModelCarFilters {
  manufacturer?: number
  search?: string
  limit?: number
  offset?: number
  page_size?: number
}
