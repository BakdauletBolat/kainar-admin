/**
 * API Types
 * Общие типы для API запросов и ответов
 */

export interface ApiResponse<T = any> {
  data: T
  status: number
  statusText: string
}

export interface PaginatedResponse<T> {
  results: T[]
  count: number
  next: string | null
  previous: string | null
}

export interface ApiError {
  message: string
  status: number
  code?: string
  data?: any
  errors?: Record<string, string[]>
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  limit?: number
  offset?: number
}

export interface SortingParams {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface SearchParams {
  search?: string
  query?: string
}

export interface ListParams extends PaginationParams, SortingParams, SearchParams {
  [key: string]: any
}
