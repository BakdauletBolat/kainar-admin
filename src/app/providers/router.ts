/**
 * Router configuration
 * Конфигурация роутера приложения
 */

import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@entities/user'

const routes: RouteRecordRaw[] = [
  // Auth routes
  {
    path: '/login',
    name: 'login',
    component: () => import('@pages/login/ui/LoginPage.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@pages/profile/ui/ProfilePage.vue'),
    meta: { requiresAuth: true, roles: ['all'] }
  },

  // Parts routes
  {
    path: '/',
    name: 'main',
    redirect: { name: 'parts-list' }
  },
  {
    path: '/parts/list',
    name: 'parts-list',
    component: () => import('@pages/parts/list/ui/PartsListPage.vue'),
    meta: { requiresAuth: true, roles: ['all'] }
  },
  {
    path: '/parts/create',
    name: 'parts-create',
    component: () => import('@pages/parts/create/ui/PartCreatePage.vue'),
    meta: { requiresAuth: true, roles: ['all'] }
  },
  {
    path: '/parts/:id/edit',
    name: 'parts-edit',
    component: () => import('@pages/parts/edit/ui/PartEditPage.vue'),
    meta: { requiresAuth: true, roles: ['all'] }
  },
  {
    path: '/parts/:id',
    name: 'parts-detail',
    component: () => import('@pages/parts/detail/ui/PartDetailPage.vue'),
    meta: { requiresAuth: true, roles: ['all'] }
  },

  // Orders routes
  {
    path: '/order/list',
    name: 'orders-list',
    component: () => import('@pages/orders/list/ui/OrdersListPage.vue'),
    meta: { requiresAuth: true, roles: ['all'] }
  },
  {
    path: '/order/list/in-progress',
    name: 'orders-list-in-progress',
    component: () => import('@pages/orders/in-progress/ui/OrdersInProgressPage.vue'),
    meta: { requiresAuth: true, roles: ['all'] }
  },
  {
    path: '/order/create',
    name: 'orders-create',
    component: () => import('@pages/orders/create/ui/OrderCreatePage.vue'),
    meta: { requiresAuth: true, roles: ['all'] }
  },
  {
    path: '/order/:id/edit',
    name: 'orders-edit',
    component: () => import('@pages/orders/edit/ui/OrderEditPage.vue'),
    meta: { requiresAuth: true, roles: ['all'] }
  },
  {
    path: '/order/:id',
    name: 'orders-detail',
    component: () => import('@pages/orders/detail/ui/OrderDetailPage.vue'),
    meta: { requiresAuth: true, roles: ['all'] }
  },

  // Warehouses routes
  {
    path: '/warehouse/list',
    name: 'warehouses-list',
    component: () => import('@pages/warehouses/list/ui/WarehousesListPage.vue'),
    meta: { requiresAuth: true, roles: ['Директор'] }
  },
  {
    path: '/warehouse/create',
    name: 'warehouses-create',
    component: () => import('@pages/warehouses/create/ui/WarehouseCreatePage.vue'),
    meta: { requiresAuth: true, roles: ['Директор'] }
  },
  {
    path: '/warehouse/:id/edit',
    name: 'warehouses-edit',
    component: () => import('@pages/warehouses/edit/ui/WarehouseEditPage.vue'),
    meta: { requiresAuth: true, roles: ['Директор'] }
  },
  {
    path: '/warehouse/:id',
    name: 'warehouses-detail',
    component: () => import('@pages/warehouses/detail/ui/WarehouseDetailPage.vue'),
    meta: { requiresAuth: true, roles: ['Директор'] }
  },

  // Clients routes
  {
    path: '/clients/list',
    name: 'clients-list',
    component: () => import('@pages/clients/list/ui/ClientsListPage.vue'),
    meta: { requiresAuth: true, roles: ['Директор'] }
  },
  {
    path: '/clients/create',
    name: 'clients-create',
    component: () => import('@pages/clients/create/ui/ClientCreatePage.vue'),
    meta: { requiresAuth: true, roles: ['Директор'] }
  },
  {
    path: '/clients/:id',
    name: 'clients-detail',
    component: () => import('@pages/clients/detail/ui/ClientDetailPage.vue'),
    meta: { requiresAuth: true, roles: ['Директор'] }
  },

  // Feedbacks routes
  {
    path: '/feedbacks/list',
    name: 'feedbacks-list',
    component: () => import('@pages/feedbacks/list/ui/FeedbacksListPage.vue'),
    meta: { requiresAuth: true, roles: ['all'] }
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

/**
 * Auth guard
 * Проверяет аутентификацию и права доступа
 */
router.beforeEach((to, _from) => {
  const userStore = useUserStore()

  // Проверка аутентификации
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return {
      name: 'login',
      query: { redirectUrl: to.fullPath }
    }
  }

  // Редирект с логина если уже залогинен
  if (userStore.isAuthenticated && to.name === 'login') {
    return { name: 'main' }
  }

  // Проверка ролей
  if (to.meta.roles) {
    const hasAccess = userStore.hasAnyRole(to.meta.roles as string[])
    if (!hasAccess) {
      return { name: 'main' }
    }
  }

  return true
})
