/**
 * API Types
 * Общие типы для API запросов и ответов
 *
 * Использование:
 * import type { ApiResponse, PaginatedResponse, ApiError } from '@shared/api/base/api-types'
 */

/**
 * Стандартный ответ API
 */
export interface ApiResponse<T = any> {
  data: T
  status: number
  statusText: string
}

/**
 * Пагинированный ответ API (Django Rest Framework style)
 */
export interface PaginatedResponse<T> {
  results: T[]
  count: number
  next: string | null
  previous: string | null
}

/**
 * Ошибка API
 */
export interface ApiError {
  message: string
  status: number
  code?: string
  data?: any
  errors?: Record<string, string[]>
}

/**
 * Параметры пагинации
 */
export interface PaginationParams {
  page?: number
  pageSize?: number
  limit?: number
  offset?: number
}

/**
 * Параметры сортировки
 */
export interface SortingParams {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * Параметры поиска
 */
export interface SearchParams {
  search?: string
  query?: string
}

/**
 * Базовые параметры для list запросов
 */
export interface ListParams extends PaginationParams, SortingParams, SearchParams {
  [key: string]: any
}
