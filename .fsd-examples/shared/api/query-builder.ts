/**
 * Query Builder Utilities
 * Централизованные функции для построения query strings
 *
 * ЗАМЕНЯЕТ дублированный код generateQuery из:
 * - src/apis/orders.ts
 * - src/apis/products.ts
 * - src/utils/generateQuery.ts
 *
 * Использование:
 * import { buildQueryString, buildUrlWithQuery } from '@shared/api/lib/query-builder'
 */

/**
 * Строит query string из объекта параметров
 *
 * @example
 * buildQueryString({ page: 1, search: 'test', category: null })
 * // => "?page=1&search=test"
 */
export function buildQueryString(params: Record<string, any>): string {
  const queryParams = Object.entries(params)
    .filter(([_, value]) => value != null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')

  return queryParams ? `?${queryParams}` : ''
}

/**
 * Строит полный URL с query параметрами
 *
 * @example
 * buildUrlWithQuery('/api/products', { page: 1, limit: 20 })
 * // => "/api/products?page=1&limit=20"
 */
export function buildUrlWithQuery(baseUrl: string, params: Record<string, any>): string {
  const queryString = buildQueryString(params)
  return `${baseUrl}${queryString}`
}

/**
 * Парсит query string в объект
 *
 * @example
 * parseQueryString('?page=1&search=test')
 * // => { page: '1', search: 'test' }
 */
export function parseQueryString(queryString: string): Record<string, string> {
  if (!queryString || queryString === '?') return {}

  const params = new URLSearchParams(queryString)
  const result: Record<string, string> = {}

  params.forEach((value, key) => {
    result[key] = value
  })

  return result
}
