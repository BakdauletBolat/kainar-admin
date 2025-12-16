/**
 * HTTP Client
 * Централизованный Axios instance с настроенными interceptors
 *
 * ЗАМЕНЯЕТ: src/apis/index.ts
 */

import axios from 'axios'
import { API_CONFIG } from './api-config'
import { authRequestInterceptor, authRequestErrorInterceptor } from '../interceptors/auth-interceptor'
import { successResponseInterceptor, errorResponseInterceptor } from '../interceptors/error-interceptor'

/**
 * Создаем Axios instance с базовой конфигурацией
 */
export const httpClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request interceptors
 */
httpClient.interceptors.request.use(
  authRequestInterceptor,
  authRequestErrorInterceptor
)

/**
 * Response interceptors
 */
httpClient.interceptors.response.use(
  successResponseInterceptor,
  errorResponseInterceptor
)

/**
 * Export default для обратной совместимости
 */
export default httpClient
