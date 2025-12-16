/**
 * Auth Interceptor
 * Request interceptor для добавления Bearer token
 *
 * ВАЖНО: НЕ импортировать stores здесь (избегаем циклических зависимостей)
 *
 * Использование:
 * httpClient.interceptors.request.use(authRequestInterceptor)
 */

import type { InternalAxiosRequestConfig } from 'axios'

/**
 * Добавляет Bearer token к каждому запросу
 */
export function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  const token = localStorage.getItem('auth-token')

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
}

/**
 * Обработчик ошибок request interceptor
 */
export function authRequestErrorInterceptor(error: any) {
  return Promise.reject(error)
}
