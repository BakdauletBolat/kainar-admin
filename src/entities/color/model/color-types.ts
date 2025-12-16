/**
 * Color Entity Types
 * МИГРИРУЕТ: src/stores/color-store.ts (interfaces)
 */

/**
 * Цвет
 */
export interface Color {
  id: number
  name: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Опция для select
 */
export interface ColorOption {
  label: string
  value: number
}
