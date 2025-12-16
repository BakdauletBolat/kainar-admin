/**
 * Manufacturer Entity Types
 * МИГРИРУЕТ: src/stores/manufacturer-store.ts (interfaces)
 */

/**
 * Производитель автомобилей
 */
export interface Manufacturer {
  id: number
  name: string
  image?: string | null
  createdAt?: string
  updatedAt?: string
}

/**
 * Опция для select
 */
export interface ManufacturerOption {
  label: string
  value: number
}

/**
 * Группировка производителей по первой букве
 */
export interface ManufacturersByLetter {
  [letter: string]: Manufacturer[]
}
