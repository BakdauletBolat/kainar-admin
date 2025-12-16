/**
 * User API
 * Чистые API функции для работы с пользователями
 *
 * МИГРИРУЕТ: Функциональность из src/stores/auth-store.ts
 */

import { httpClient } from '@shared/api/base/http-client'
import { ENDPOINTS } from '@shared/api/base/api-config'
import type { LoginCredentials, AuthTokenResponse, User } from '../model/user-types'

export const userApi = {
  /**
   * Авторизация пользователя
   */
  login: (credentials: LoginCredentials) =>
    httpClient.post<AuthTokenResponse>(ENDPOINTS.AUTH.LOGIN, {
      ...credentials,
      is_admin_user: true,
    }),

  /**
   * Получение текущего пользователя
   */
  getMe: () => httpClient.get<User>(ENDPOINTS.AUTH.ME),

  /**
   * Обновление профиля пользователя
   */
  updateProfile: (userId: number, data: Partial<User>) =>
    httpClient.patch<User>(`/api/users/${userId}/`, data),
}
