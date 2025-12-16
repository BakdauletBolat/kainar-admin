/**
 * Part Entity Types
 * МИГРИРУЕТ: src/apis/products.ts (interfaces)
 */

export interface Part {
  id: number
  name: string
  article?: string // Артикул
  description?: string // Описание
  price: number | null
  marketPrice: number | null
  status: PartStatus
  warehouse: PartWarehouse
  category: PartCategory
  modelCar: ModelCar
  color: string | null
  pictures: PartPicture[]
  detail: PartDetail | null
  eavAttributes: EavAttributes
  code: any[]
  properties: any | null
  defect: any | null
  comment: any | null
  mileage: number | null
  mileageType: any | null
  modification: number
  createdAt: string
  updatedAt: string
}

export type PartStatus = 'available' | 'sold' | 'reserved' | 'deleted' | 'processing'

export interface PartWarehouse {
  id: number
  name: string
  city: {
    id: number
    name: string
    uid: string | null
    country: number
    createdAt?: string
    updatedAt?: string
  }
  categories: PartCategory[]
  minStockLevel?: number
}

export interface PartCategory {
  id: number
  name: string
  recarCategoryId: number
  parent: number | null
  createdAt?: string
  updatedAt?: string
}

export interface PartPicture {
  id: number
  image: string
  product: number
}

export interface PartDetail {
  id: number
  height: number
  width: number
  length: number
  weight: number
}

export interface ModelCar {
  id: number
  name: string
  startDate: string
  endDate: string
  manufacturer: Manufacturer | number
}

export interface Manufacturer {
  id: number
  name: string
}

export interface EavAttributes {
  axleConfiguration?: string
  bodyType?: string
  capacity?: string
  driveType?: string
  engineDisplacement?: string
  fuelType?: string
  gearType?: string
  numberOfCycle?: string
  numberOfValves?: string
  power?: string
  steeringType?: string
  vinCode?: string
  modelCar?: ModelCar
}

/**
 * Фильтры для списка запчастей
 */
export interface PartFilters {
  search?: string | null
  category?: string | null
  modification?: string | null
  modelCar?: string | null
  manufacturer?: number | null
  warehouseId?: number | null
  status?: PartStatus
  // EAV фильтры
  axleConfiguration?: number | null
  bodyType?: number | null
  capacity?: number | null
  driveType?: number | null
  engineDisplacement?: number | null
  fuelType?: number | null
  gearType?: number | null
  numberOfCycle?: number | null
  numberOfValves?: number | null
  power?: number | null
  steeringType?: number | null
  vinCode?: number | null
  // Пагинация
  page?: number
  pageSize?: number
  limit?: number
  offset?: number
  // Сортировка
  ordering?: string
}

/**
 * Упрощенная версия Part для списков
 */
export interface PartListItem {
  id: number
  name: string
  price: number
  marketPrice: number
  status: string
  warehouse: {
    name: string
    city: {
      name: string
    }
  }
  category: {
    name: string
  }
  modelCar: {
    name: string
  }
  pictures: PartPicture[]
  createdAt: Date
  updatedAt: Date
}

/**
 * DTO для создания запчасти
 */
export interface CreatePartDto {
  name: string
  article: string
  price: number
  category: number | null
  warehouse: number | null
  description?: string
  modelCar?: number | null
  color?: string | null
  status?: PartStatus
}

/**
 * DTO для обновления запчасти
 */
export interface UpdatePartDto {
  name?: string
  article?: string
  price?: number
  category?: number | null
  warehouse?: number | null
  description?: string
  modelCar?: number | null
  color?: string | null
  status?: PartStatus
}
