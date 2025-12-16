/**
 * API Configuration
 * Централизованная конфигурация для всех API запросов
 */

export const API_CONFIG = {
  BASE_URL: 'https://back-kaynar.kz',
  TIMEOUT: 10000,
} as const

/**
 * Централизованные endpoints
 * Все API endpoints в одном месте для легкого управления
 */
export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/api/admin/users/token/',
    ME: '/api/admin/users/me/',
  },

  // Parts (Products)
  PARTS: {
    LIST: '/api/admin/product/v2/product/',
    DETAIL: (id: string | number) => `/api/admin/product/v2/${id}/product/`,
    BULK_DELETE: '/api/admin/product/v2/product/bulk-delete/',
  },

  // Orders
  ORDERS: {
    LIST: '/api/admin/orders/',
    DETAIL: (id: string | number) => `/api/admin/orders/${id}/`,
    CONFIRM: (id: string | number) => `/api/admin/orders/${id}/confirm/`,
    REFUND: '/api/admin/orders/refund/',
  },

  // Warehouses
  WAREHOUSES: {
    LIST: '/api/admin/stock/warehouses/',
    DETAIL: (id: string | number) => `/api/admin/stock/warehouses/${id}/`,
  },

  // Clients
  CLIENTS: {
    LIST: '/api/admin/users/',
    DETAIL: (id: string | number) => `/api/users/${id}/`,
  },

  // Categories
  CATEGORIES: {
    LIST: '/api/admin/category/',
    TREE: '/api/admin/category/tree',
    DETAIL: (id: number) => `/api/admin/category/${id}/`,
  },

  // Manufacturers
  MANUFACTURERS: {
    LIST: '/api/admin/car/manufacturers/',
    MODELS: '/api/admin/car/models/',
  },

  // Modifications
  MODIFICATIONS: {
    LIST: '/api/admin/car/modifications/',
  },

  // Filters
  FILTERS: {
    CAR_FILTERS: '/api/admin/car/filters/',
  },

  // Colors
  COLORS: {
    LIST: '/api/admin/car/color/',
  },

  // Feedbacks
  FEEDBACKS: {
    LIST: '/api/admin/feedback/',
  },

  // Dashboard
  DASHBOARD: {
    INFO: '/api/admin/dashboard-info/',
  },
} as const
