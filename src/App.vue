<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <div class="relative min-h-screen bg-[#f6f7fb] text-slate-900">
        <div class="pointer-events-none absolute inset-0 -z-10">
          <div class="absolute -top-28 -left-24 h-72 w-72 rounded-full bg-[#dce7ff] blur-3xl opacity-80"></div>
          <div class="absolute top-10 right-[-60px] h-80 w-80 rounded-full bg-[#ffe8b5] blur-3xl opacity-70"></div>
          <div class="absolute bottom-[-120px] left-1/4 h-96 w-96 rounded-full bg-[#c7f0ff] blur-3xl opacity-60"></div>
        </div>
        <n-layout has-sider class="!bg-transparent">
          <n-layout-sider bordered
            class="!hidden md:!block h-screen !z-[99] !fixed bg-white/70 backdrop-blur-2xl border-r border-white/60 shadow-[0_18px_60px_rgba(15,23,42,0.12)]"
            collapse-mode="width" :collapsed-width="72" :width="260" :collapsed="collapsed" show-trigger
            @collapse="collapsed = true" @expand="collapsed = false">
            <div class="flex items-center gap-3 px-4 py-5">
              <Avatar class="h-[44px] w-[44px]" :url="Logo"></Avatar>
              <div :class="{ 'hidden': collapsed }" class="leading-tight">
                <p class="text-xs text-slate-500">Админ</p>
                <p class="text-xl font-semibold text-slate-900">Управление</p>
              </div>
            </div>
            <div class="px-4" v-if="!collapsed">
              <div class="mb-4 rounded-2xl border border-white/80 bg-white/70 px-4 py-3 text-xs text-slate-600 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
                <p class="text-[13px] font-semibold text-slate-900">Сегодня</p>
                <p class="mt-1">Быстрый доступ к управлению заказами и складами.</p>
              </div>
            </div>
            <n-menu :collapsed="collapsed" :collapsed-width="72" :collapsed-icon-size="22"
              :options="filteredMenuOptions" :expand-icon="expandIcon" />
          </n-layout-sider>
          <n-layout class="!bg-transparent">
            <div class="flex">
              <div class="hidden md:block transition-all duration-300"
                :style="{ width: collapsed ? '72px' : '260px' }"></div>
              <div class="w-full max-w-6xl mx-auto px-4 md:px-6 lg:px-10 pb-24 pt-6">
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
      </div>
    </n-message-provider>
  </n-config-provider>
</template>
<script setup lang="ts">
import { NMessageProvider, NConfigProvider, NLayout, NMenu, NLayoutSider, NIcon, NBadge } from 'naive-ui';
import { computed, h, onMounted, ref } from 'vue'
import type { Component } from 'vue'

//@ts-ignore
import { CaretDownOutline } from '@vicons/ionicons5';

import {
  CogIcon,
  HomeIcon,
  ShoppingCartIcon,
  InboxIcon,
  UsersIcon,
  UserIcon,
  ShoppingBagIcon,
  QuestionMarkCircleIcon
} from '@heroicons/vue/24/outline';
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

function renderOrdersInProgressIcon(icon: Component) {
  return () => h(
      NBadge, {
        value: dashboardInfo.value.orders_inprogress_count
      }, {
        default: () => h(NIcon, null, { default: () => h(icon) })
      }
  )
}

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
            name: 'main',
          }
        },
        { default: () => 'Главная' }
      ),
    key: 'main',
    icon: renderIcon(HomeIcon),
    roles: ["all"] as string[]
  },
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
    icon: renderOrdersInProgressIcon(ShoppingBagIcon),
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
