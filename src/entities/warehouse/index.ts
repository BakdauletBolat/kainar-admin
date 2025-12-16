/**
 * Warehouse Entity - Public API
 * Единая точка экспорта для модуля Warehouse
 */

// Store
export { useWarehouseStore } from './model/warehouse-store'

// API
export { warehouseApi } from './api/warehouse-api'

// Types
export type {
  Warehouse,
  WarehouseListItem,
  WarehouseOption,
  WarehouseFilters,
  City,
  CreateWarehouseDto,
  UpdateWarehouseDto
} from './model/warehouse-types'
