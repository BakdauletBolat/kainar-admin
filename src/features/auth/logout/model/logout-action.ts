/**
 * Logout Action
 * Действие выхода из системы
 */

import { useUserStore } from '@entities/user'
import { useRouter } from 'vue-router'

export function useLogout() {
  const userStore = useUserStore()
  const router = useRouter()

  async function logout() {
    await userStore.logout()
    router.push('/login')
  }

  return {
    logout
  }
}
