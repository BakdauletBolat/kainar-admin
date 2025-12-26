import { createRouter, createWebHistory } from "vue-router"

import { HomePage } from "@/pages/home";
import { PartsListPage, PartCreatePage, PartEditPage, PartDetailPage } from "@/pages/parts";
import { OrdersListPage, OrderCreatePage, OrderEditPage, OrderDetailPage, OrdersInProgressPage } from "@/pages/orders";
import { ClientsListPage, ClientCreatePage, ClientDetailPage } from "@/pages/clients";
import { WarehousesListPage, WarehouseCreatePage, WarehouseEditPage, WarehouseDetailPage } from "@/pages/warehouses";
import { LoginPage, ProfilePage } from "@/pages/auth";
import { FeedbacksListPage } from "@/pages/feedbacks";

import { useUserStore } from "@/entities/user";


const routes = [
  { path: '/', name: 'main', component: HomePage, meta: { roles: ["all"] } },
  { path: '/order/list',name: 'orders-list', component: OrdersListPage, meta: { roles: ["all"] } },
  { path: '/order/create',name: 'orders-create', component: OrderCreatePage, meta: { roles: ["all"] } },
  { path: '/order/:id/edit',name: 'orders-edit', component: OrderEditPage, meta: { roles: ["all"] } },
  { path: '/order/:id',name: 'orders-detail', component: OrderDetailPage, meta: { roles: ["all"] } },
  { path: '/parts/list',name: 'parts-list', component: PartsListPage, meta: { roles: ["all"] } },
  { path: '/parts/create',name: 'parts-create', component: PartCreatePage, meta: { roles: ["all"] } },
  { path: '/parts/:id/edit',name: 'parts-edit', component: PartEditPage, meta: { roles: ["all"] } },
  { path: '/parts/:id',name: 'parts-detail', component: PartDetailPage, meta: { roles: ["all"] } },
  { path: '/warehouse/list',name: 'warehouses-list', component: WarehousesListPage, meta: { roles: ["Директор"] } },
  { path: '/warehouse/create',name: 'warehouses-create', component: WarehouseCreatePage, meta: { roles: ["Директор"] } },
  { path: '/warehouse/:id/edit',name: 'warehouses-edit', component: WarehouseEditPage, meta: { roles: ["Директор"] } },
  { path: '/warehouse/:id',name: 'warehouses-detail', component: WarehouseDetailPage, meta: { roles: ["Директор"] } },
  { path: '/clients/list', name: 'clients-list', component: ClientsListPage, meta: { roles: ["Директор"] } },
  { path: '/clients/create', name: 'clients-create', component: ClientCreatePage, meta: { roles: ["Директор"] } },
  { path: '/clients/:id', name: 'clients-detail', component: ClientDetailPage, meta: { roles: ["Директор"] } },
  { path: '/feedbacks/list', name: 'feedbacks-list', component: FeedbacksListPage, meta: { roles: ["all"] } },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/profile', name: 'profile', component: ProfilePage, meta: { roles: ["all"] } },
  { path: '/order/list/in-progress',name: 'orders-list-in-progress', component: OrdersInProgressPage, meta: { roles: ["all"] } },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { left: 0, top: 0 };
  }
})

router.beforeEach((to, _) => {
  const userStore = useUserStore();
  if (!userStore.isAuthenticated && to.name !== 'login') {
    return {name: 'login', query: {
        redirectUrl: to.fullPath
      }}
  }
  if (userStore.isAuthenticated && to.name == 'login') {
    return {name: 'main'}
  }
  // Проверка прав
  if (to.meta && to.meta.roles) {
    const hasAccess = userStore.hasAnyRole(to.meta.roles as string[]);
    if (!hasAccess) {
      return { name: 'main' };
    }
  }
})



export default router;
