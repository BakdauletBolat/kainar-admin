/**
 * User Store
 * Pinia store для управления состоянием пользователя
 *
 * ЗАМЕНЯЕТ: src/stores/auth-store.ts
 * УЛУЧШЕНИЯ: Composition API вместо Options API, разделение API и Store
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials } from './user-types'
import { userApi } from '../api/user-api'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const isAuthenticated = ref(!!localStorage.getItem('auth-token'))

  // Getters
  const hasRole = computed(() => (role: string) => {
    if (role === 'all') return true
    if (!user.value || !user.value.roles) return false
    return user.value.roles.some(r => r.name === role)
  })

  const hasAnyRole = computed(() => (roles: string[]) => {
    if (roles.includes('all')) return true
    if (!user.value || !user.value.roles) return false
    return user.value.roles.some(r => roles.includes(r.name))
  })

  // Actions
  async function login(credentials: LoginCredentials) {
    isLoading.value = true
    try {
      const { data } = await userApi.login(credentials)
      localStorage.setItem('auth-token', data.access)
      isAuthenticated.value = true
      await fetchUser()
    } finally {
      isLoading.value = false
    }
  }

  async function fetchUser() {
    try {
      const { data } = await userApi.getMe()
      user.value = mapUserFromApi(data)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      logout()
    }
  }

  async function updateProfile(data: Partial<User>) {
    if (!user.value) return
    isLoading.value = true
    try {
      const response = await userApi.updateProfile(user.value.id, data)
      user.value = mapUserFromApi(response.data)
      return response.data
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    localStorage.removeItem('auth-token')
    user.value = null
    isAuthenticated.value = false
    // Роутер будет обработан в error-interceptor
  }

  return {
    // State
    user,
    isLoading,
    isAuthenticated,
    // Getters
    hasRole,
    hasAnyRole,
    // Actions
    login,
    fetchUser,
    loadMe: fetchUser, // Alias для совместимости
    updateProfile,
    logout,
  }
})

/**
 * Mapper: API response (snake_case) → Domain model (camelCase)
 */
function mapUserFromApi(apiUser: any): User {
  return {
    id: apiUser.id,
    phone: apiUser.phone,
    email: apiUser.email,
    firstName: apiUser.first_name,
    lastName: apiUser.last_name,
    middleName: apiUser.middle_name,
    profileType: apiUser.profile_type,
    city: apiUser.city,
    uuid: apiUser.uuid,
    dateJoined: apiUser.date_joined,
    roles: apiUser.roles,
    isActive: apiUser.is_active,
    isStaff: apiUser.is_staff,
    isSuperuser: apiUser.is_superuser,
    lastLogin: apiUser.last_login,
  }
}
