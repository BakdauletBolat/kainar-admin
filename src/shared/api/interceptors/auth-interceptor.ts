/**
 * Auth Interceptor
 * Request interceptor для добавления Bearer token
 *
 * ВАЖНО: НЕ импортировать stores здесь (избегаем циклических зависимостей)
 */

import type { InternalAxiosRequestConfig } from 'axios'

export function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  const token = localStorage.getItem('auth-token')

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
}

export function authRequestErrorInterceptor(error: any) {
  return Promise.reject(error)
}
