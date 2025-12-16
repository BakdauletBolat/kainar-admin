/**
 * Error Interceptor
 * Response interceptor для централизованной обработки ошибок
 *
 * РЕШЕНИЕ циклических зависимостей:
 * Использует dynamic import для store/router вместо прямого импорта
 */

import type { AxiosError, AxiosResponse } from 'axios'

export function successResponseInterceptor(response: AxiosResponse) {
  // Проверка на server errors
  if (response.status === 500) {
    throw new Error(response.data?.message || 'Server error')
  }

  return response
}

export async function errorResponseInterceptor(error: AxiosError) {
  const status = error.response?.status

  // Обработка 401 (Unauthorized) и 403 (Forbidden)
  if (status === 401 || status === 403) {
    try {
      // Dynamic import для избежания циклических зависимостей
      const { useUserStore } = await import('@entities/user')
      const router = (await import('@/routers')).default

      const userStore = useUserStore()
      userStore.logout()

      // Редирект на страницу логина
      router.push({ name: 'login' })
    } catch (importError) {
      console.error('Failed to handle auth error:', importError)
      // Fallback: просто очищаем токен и перезагружаем страницу
      localStorage.removeItem('auth-token')
      window.location.href = '/login'
    }
  }

  // Логирование server errors (500+)
  if (status && status >= 500) {
    console.error('Server error:', {
      status,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data,
    })
  }

  return Promise.reject(error)
}
