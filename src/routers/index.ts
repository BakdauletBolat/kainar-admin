import { createRouter, createWebHistory } from "vue-router"

import WarehouseList from "@/views/warehouses/index.vue";
import WarehouseCreate from "@/views/warehouses/create.vue";
import WarehouseEdit from "@/views/warehouses/edit.vue";
import WarehouseDetail from "@/views/warehouses/detail.vue";
import OrderList from "@/modules/orders/pages/OrdersListPage.vue";
import OrderListInProgress from "@/modules/orders/pages/OrdersInProgressPage.vue";
import OrderCreate from "@/modules/orders/pages/OrderCreatePage.vue";
import OrderEdit from "@/modules/orders/pages/OrderEditPage.vue";
import OrderDetail from "@/modules/orders/pages/OrderDetailPage.vue";
import PartsList from "@/views/parts/index.vue";
import PartsCreate from "@/views/parts/create.vue";
import PartsEdit from "@/views/parts/edit.vue";
import PartsDetail from "@/views/parts/detail.vue";
import ClientsList from "@/views/clients/index.vue";
import ClientDetail from "@/views/clients/detail.vue";
import ClientCreate from "@/views/clients/create.vue";
import FeedbackList from "@/views/feedbacks/index.vue";
import Home from "@/views/Home.vue";

import Login from "@/views/auth/login.vue";
import Profile from "@/views/auth/profile.vue";



import {useAuthStore} from "@/stores/auth-store.ts";


const routes = [
  { path: '/', name: 'main', component: Home, meta: { roles: ["all"] } },
  { path: '/order/list',name: 'orders-list', component: OrderList, meta: { roles: ["all"] } },
  { path: '/order/create',name: 'orders-create', component: OrderCreate, meta: { roles: ["all"] } },
  { path: '/order/:id/edit',name: 'orders-edit', component: OrderEdit, meta: { roles: ["all"] } },
  { path: '/order/:id',name: 'orders-detail', component: OrderDetail, meta: { roles: ["all"] } },
  { path: '/parts/list',name: 'parts-list', component: PartsList, meta: { roles: ["all"] } },
  { path: '/parts/create',name: 'parts-create', component: PartsCreate, meta: { roles: ["all"] } },
  { path: '/parts/:id/edit',name: 'parts-edit', component: PartsEdit, meta: { roles: ["all"] } },
  { path: '/parts/:id',name: 'parts-detail', component: PartsDetail, meta: { roles: ["all"] } },
  { path: '/warehouse/list',name: 'warehouses-list', component: WarehouseList, meta: { roles: ["Директор"] } },
  { path: '/warehouse/create',name: 'warehouses-create', component: WarehouseCreate, meta: { roles: ["Директор"] } },
  { path: '/warehouse/:id/edit',name: 'warehouses-edit', component: WarehouseEdit, meta: { roles: ["Директор"] } },
  { path: '/warehouse/:id',name: 'warehouses-detail', component: WarehouseDetail, meta: { roles: ["Директор"] } },
  { path: '/clients/list', name: 'clients-list', component: ClientsList, meta: { roles: ["Директор"] } },
  { path: '/clients/create', name: 'clients-create', component: ClientCreate, meta: { roles: ["Директор"] } },
  { path: '/clients/:id', name: 'clients-detail', component: ClientDetail, meta: { roles: ["Директор"] } },
  { path: '/feedbacks/list', name: 'feedbacks-list', component: FeedbackList, meta: { roles: ["all"] } },
  { path: '/login', name: 'login', component: Login },
  { path: '/profile', name: 'profile', component: Profile, meta: { roles: ["all"] } },
  { path: '/order/list/in-progress',name: 'orders-list-in-progress', component: OrderListInProgress, meta: { roles: ["all"] } },
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
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated && to.name !== 'login') {
    return {name: 'login', query: {
        redirectUrl: to.fullPath
      }}
  }
  if (authStore.isAuthenticated && to.name == 'login') {
    return {name: 'main'}
  }
  // Проверка прав
  if (to.meta && to.meta.roles) {
    const hasAccess = authStore.hasAnyRole(to.meta.roles as string[]);
    if (!hasAccess) {
      return { name: 'main' };
    }
  }
})



export default router;
