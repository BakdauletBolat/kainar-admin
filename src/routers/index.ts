import { createRouter, createWebHistory } from "vue-router"

import WarehouseList from "@/views/warehouses/index.vue";
import WarehouseCreate from "@/views/warehouses/create.vue";
import WarehouseEdit from "@/views/warehouses/edit.vue";
import WarehouseDetail from "@/views/warehouses/detail.vue";
import OrderList from "@/views/orders/index.vue";
import OrderCreate from "@/views/orders/create.vue";
import OrderEdit from "@/views/orders/edit.vue";
import OrderDetail from "@/views/orders/detail.vue";
import PartsList from "@/views/parts/index.vue";
import PartsCreate from "@/views/parts/create.vue";
import PartsEdit from "@/views/parts/edit.vue";
import PartsDetail from "@/views/parts/detail.vue";
import ClientsList from "@/views/clients/index.vue";
import ClientDetail from "@/views/clients/detail.vue";
import ClientCreate from "@/views/clients/create.vue";
import FeedbackList from "@/views/feedbacks/index.vue";

import Login from "@/views/auth/login.vue";
import Profile from "@/views/auth/profile.vue";



import {useAuthStore} from "@/stores/auth-store.ts";


const routes = [
  { path: '/', name: 'main', component: PartsList },
  { path: '/order/list',name: 'orders-list', component: OrderList },
  { path: '/order/create',name: 'orders-create', component: OrderCreate },
  { path: '/order/:id/edit',name: 'orders-edit', component: OrderEdit },
  { path: '/order/:id',name: 'orders-detail', component: OrderDetail },
  { path: '/parts/list',name: 'parts-list', component: PartsList },
  { path: '/parts/create',name: 'parts-create', component: PartsCreate },
  { path: '/parts/:id/edit',name: 'parts-edit', component: PartsEdit },
  { path: '/parts/:id',name: 'parts-detail', component: PartsDetail },
  { path: '/warehouse/list',name: 'warehouses-list', component: WarehouseList },
  { path: '/warehouse/create',name: 'warehouses-create', component: WarehouseCreate },
  { path: '/warehouse/:id/edit',name: 'warehouses-edit', component: WarehouseEdit },
  { path: '/warehouse/:id',name: 'warehouses-detail', component: WarehouseDetail },
  { path: '/clients/list', name: 'clients-list', component: ClientsList },
  { path: '/clients/create', name: 'clients-create', component: ClientCreate },
  { path: '/clients/:id', name: 'clients-detail', component: ClientDetail },
  { path: '/feedbacks/list', name: 'feedbacks-list', component: FeedbackList},
  { path: '/login', name: 'login', component: Login },
  { path: '/profile', name: 'profile', component: Profile },
  { path: '/order/list/in-progress',name: 'orders-list-in-progress', component: OrderList },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
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
})



export default router;