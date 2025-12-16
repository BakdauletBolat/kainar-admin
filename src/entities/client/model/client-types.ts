/**
 * Client Entity Types
 * МИГРИРУЕТ: src/stores/client-store.ts (Client interface)
 */

/**
 * Клиент
 */
export interface Client {
  id: number
  email?: string
  firstName?: string
  lastName?: string
  middleName?: string
  phone?: string
  profileType: number
  city?: any
  dateJoined: Date
}

/**
 * Фильтры для клиентов
 */
export interface ClientFilters {
  search?: string
  profileType?: number
  limit?: number
  offset?: number
  page?: number
  pageSize?: number
  sort?: string
}
