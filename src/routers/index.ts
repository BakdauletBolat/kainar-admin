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


const routes = [
  { path: '/', component: PartsList },
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
  { path: '/clients/list',name: 'clients-list', component: ClientsList },
  { path: '/clients/:id',name: 'clients-detail', component: ClientsList },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
})



export default router;