/**
 * Query Builder Utilities
 * Централизованные функции для построения query strings
 *
 * ЗАМЕНЯЕТ дублированный код generateQuery из:
 * - src/apis/orders.ts
 * - src/apis/products.ts
 * - src/utils/generateQuery.ts
 */

/**
 * Строит query string из объекта параметров
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
 */
export function buildUrlWithQuery(baseUrl: string, params: Record<string, any>): string {
  const queryString = buildQueryString(params)
  return `${baseUrl}${queryString}`
}

/**
 * Парсит query string в объект
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
