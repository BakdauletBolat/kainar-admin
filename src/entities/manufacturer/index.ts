/**
 * Manufacturer Entity - Public API
 * Единая точка экспорта для модуля Manufacturer
 */

// Store
export { useManufacturerStore } from './model/manufacturer-store'

// API
export { manufacturerApi } from './api/manufacturer-api'

// Utils
export {
  groupManufacturersByLetter,
  manufacturersToOptions,
  findManufacturerById
} from './lib/manufacturer-utils'

// Types
export type {
  Manufacturer,
  ManufacturerOption,
  ManufacturersByLetter
} from './model/manufacturer-types'
