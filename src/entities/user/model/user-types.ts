/**
 * User Entity Types
 * МИГРИРУЕТ: src/stores/auth-store.ts (interfaces)
 */

export interface User {
  id: number
  phone: string
  email: string
  firstName: string
  lastName: string
  middleName: string
  profileType: string
  city: {
    id: number
    name: string
  }
  uuid: string
  dateJoined: string
  roles: Role[]
  isActive: boolean
  isStaff: boolean
  isSuperuser: boolean
  lastLogin: string
}

export interface Role {
  name: string
}

export interface LoginCredentials {
  phone: string
  password: string
}

export interface AuthTokenResponse {
  access: string
  refresh?: string
}
