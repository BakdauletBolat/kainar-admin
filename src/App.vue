<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-dialog-provider>
      <n-layout has-sider>
        <n-layout-sider bordered class="!hidden md:!block h-screen !z-[99] !fixed" collapse-mode="width"
          :collapsed-width="64" :width="240" :collapsed="collapsed" show-trigger @collapse="collapsed = true"
          @expand="collapsed = false">
          <div class="flex justify-center p-3 gap-3 items-center">
            <Avatar class="h-[40px]" :url="Logo"></Avatar>
            <div :class="{
              'hidden': collapsed
            }" class="text-2xl">Управление</div>
          </div>
          <n-menu :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22" :options="filteredMenuOptions"
            :expand-icon="expandIcon" />
        </n-layout-sider>
        <n-layout>
          <div class="flex">
            <div class="w-[64px] h-full"></div>
            <div class="container mx-auto px-4 mb-[120px] mt-4">
              <router-view v-slot="{ Component, route }">
                <keep-alive>
                  <component :is="Component" :key="getRouteKey(route)" />
                </keep-alive>
              </router-view>
            </div>
          </div>

          <BottomAppBar class="md:hidden"></BottomAppBar>
        </n-layout>
      </n-layout>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>
<script setup lang="ts">
import { NMessageProvider, NConfigProvider, NLayout, NMenu, NLayoutSider, NIcon, NBadge } from 'naive-ui';
import { computed, defineComponent, h, onMounted, ref } from 'vue'
import type { Component } from 'vue'

//@ts-ignore
import { CaretDownOutline } from '@vicons/ionicons5';

import {CogIcon, ShoppingCartIcon, InboxIcon, UsersIcon, UserIcon,
  ShoppingBagIcon, QuestionMarkCircleIcon} from '@heroicons/vue/24/outline';
import { RouterLink } from "vue-router";
import Logo from "@/assets/new-logo.png";
import Avatar from "@/components/Avatar.vue";
import BottomAppBar from './components/BottomAppBar.vue';
import axiosIns from "@/apis";
import { useAuthStore } from '@/stores/auth-store';


interface DashboardInfo {
  orders_count: number;
  orders_inprogress_count: number;
  parts_count: number;
  sale_for_today: number;

}
const dashboardInfo = ref<DashboardInfo>({
  orders_inprogress_count: 0,
  orders_count: 0,
  parts_count: 0,
  sale_for_today: 0,
});

const userStore = useAuthStore();

onMounted(async ()=>{
  const res = await axiosIns.get("/api/admin/dashboard-info/");
  await userStore.userMe();
  dashboardInfo.value = res.data;
})

const themeOverrides = {
  common: {
    primaryColor: '#FFBF00',
    primaryColorHover: '#FFC800',
    primaryColorPressed: '#E6AC00',
    primaryColorSuppl: '#FFD34D'
  },
}

const collapsed = ref(true);
const authStore = useAuthStore();


function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const OrdersInProgressIcon = defineComponent({
  name: 'OrdersInProgressIcon',
  setup() {
    return () => h(
      NBadge,
      { value: dashboardInfo.value.orders_inprogress_count },
      { default: () => h(NIcon, null, { default: () => h(ShoppingBagIcon) }) }
    )
  }
})

function expandIcon() {
  return h(NIcon, null, { default: () => h(CaretDownOutline) })
}

const menuOptions = ref([
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'parts-list',
          }
        },
        { default: () => 'Запчасти' }
      ),
    key: 'parts-list',
    icon: renderIcon(CogIcon),
    roles: ["all", "Директор"] as string[]
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'orders-list'
          },
        },
        { default: () => 'Заказы' }
      ),
    key: 'orders-list',
    icon: renderIcon(ShoppingCartIcon),
    roles: ["all", "Директор"] as string[]
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'orders-list-in-progress'
          },
        },
        { default: () => 'Заказы в процессе' }
      ),
    key: 'orders-list-in-progress',
    icon: () => h(OrdersInProgressIcon),
    roles: ["all", "Директор"] as string[]
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'warehouses-list'
          },
        },
        { default: () => 'Склады' }
      ),
    key: 'warehouses-list',
    icon: renderIcon(InboxIcon),
    roles: ["Директор"] as string[]
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'clients-list'
          },
        },
        { default: () => 'Клиенты' }
      ),
    key: 'clients-list',
    icon: renderIcon(UsersIcon),
    roles: ["Директор"] as string[]
  },
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                name: 'profile'
              },
            },
            { default: () => 'Профиль' }
        ),
    key: 'profile',
    icon: renderIcon(UserIcon),
    roles: ["all"] as string[]
  },
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                name: 'feedbacks-list'
              },
            },
            { default: () => 'Заявки' }
        ),
    key: 'feedbacks-list',
    icon: renderIcon(QuestionMarkCircleIcon),
    roles: ["all"] as string[]
  },
]);

const filteredMenuOptions = computed(() => menuOptions.value.filter(option => Array.isArray(option.roles) && authStore.hasAnyRole(option.roles as string[])));

// Функция для генерации ключа компонента
// Для detail страниц (с параметром id) добавляем id в ключ, чтобы компонент перезагружался
// Для остальных страниц используем только имя роута для кэширования
function getRouteKey(route: any) {
  if (route.params.id) {
    return `${route.name}-${route.params.id}`;
  }
  return route.name || route.path;
}

</script>
