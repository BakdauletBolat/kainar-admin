/**
 * Color Entity - Public API
 * Единая точка экспорта для модуля Color
 */

// Store
export { useColorStore } from './model/color-store'

// API
export { colorApi } from './api/color-api'

// Types
export type {
  Color,
  ColorOption
} from './model/color-types'
