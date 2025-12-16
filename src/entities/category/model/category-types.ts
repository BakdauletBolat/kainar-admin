/**
 * Category Entity Types
 * МИГРИРУЕТ: src/stores/category-storage.ts (interfaces)
 */

/**
 * Базовая категория
 */
export interface Category {
  id: number
  name: string
  recarCategoryId: number
  parent: number | null
  createdAt?: string
  updatedAt?: string
}

/**
 * Категория с дочерними элементами (для дерева)
 */
export interface CategoryTree extends Category {
  children: CategoryTree[]
}

/**
 * Опция для select/dropdown
 */
export interface CategoryOption {
  label: string
  value: number
}

/**
 * Опция для tree select (Naive UI)
 */
export interface CategoryTreeOption {
  key: number
  label: string
  children?: CategoryTreeOption[]
}

/**
 * Фильтры для категорий
 */
export interface CategoryFilters {
  search?: string
  parent?: number | null
  limit?: number
  offset?: number
  page_size?: number
}
