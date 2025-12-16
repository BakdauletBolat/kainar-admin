/**
 * Part Entity - Public API
 * Единая точка экспорта для модуля Part
 */

// Store
export { usePartStore } from './model/part-store'

// API
export { partApi } from './api/part-api'

// Types
export type {
  Part,
  PartStatus,
  PartFilters,
  PartListItem,
  PartWarehouse,
  PartCategory,
  PartPicture,
  PartDetail,
  ModelCar,
  Manufacturer,
  EavAttributes,
  CreatePartDto,
  UpdatePartDto
} from './model/part-types'
