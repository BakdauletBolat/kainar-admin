/**
 * Category Entity - Public API
 * Единая точка экспорта для модуля Category
 */

// Store
export { useCategoryStore } from './model/category-store'

// API
export { categoryApi } from './api/category-api'

// Utils
export {
  buildCategoryTree,
  categoriesToOptions,
  findCategoryById,
  findCategoryInTree
} from './lib/category-utils'

// Types
export type {
  Category,
  CategoryTree,
  CategoryOption,
  CategoryTreeOption,
  CategoryFilters
} from './model/category-types'
