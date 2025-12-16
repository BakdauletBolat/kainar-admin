/**
 * Client Entity - Public API
 * Единая точка экспорта для модуля Client
 */

// Store
export { useClientStore } from './model/client-store'

// API
export { clientApi } from './api/client-api'

// Types
export type {
  Client,
  ClientFilters,
  CreateClientDto,
  UpdateClientDto
} from './model/client-types'
