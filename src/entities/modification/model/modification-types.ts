/**
 * Modification Entity Types
 * МИГРИРУЕТ: src/stores/modifications-store.ts (IModification)
 */

import type { ModelCar } from '@entities/model-car'

/**
 * Модификация автомобиля
 */
export interface Modification {
  id: number
  name: string
  modelCar: ModelCar
  image?: string | null
  // Технические характеристики
  axleConfiguration?: any | null
  bodyType?: string | null
  capacity?: number | null
  driveType?: string | null
  engineDisplacement?: any | null
  engines?: any[]
  fuelType?: string | null
  gearType?: any | null
  numberOfCycle?: number | null
  numberOfValves?: number | null
  power?: number | null
  steeringType?: any | null
  vinCode?: number | null
  createdAt?: string
  updatedAt?: string
}

/**
 * Фильтры для модификаций
 */
export interface ModificationFilters {
  modelCar?: number
  search?: string
  limit?: number
  offset?: number
}

/**
 * Опция для select
 */
export interface ModificationOption {
  label: string
  value: number
}
