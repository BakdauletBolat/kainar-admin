<template>
  <n-config-provider :theme-overrides="themeOverrides" :locale="ruRU" :date-locale="dateRuRU">
    <n-message-provider>
      <n-dialog-provider>
        <n-layout has-sider>
        <n-layout-sider
          bordered
          class="!hidden md:!block h-screen !bg-slate-50 !border-r !border-slate-200"
          :width="260"
          position="static"
        >
          <!-- Логотип и название -->
          <div class="flex justify-center p-4 gap-3 items-center border-b border-slate-200 bg-white h-[72px]">
            <Avatar class="h-[44px] w-[44px] rounded-xl shadow-sm" :url="Logo"></Avatar>
            <div class="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Управление
            </div>
          </div>

          <!-- Меню -->
          <div class="py-4 px-2">
            <n-menu
              :value="activeKey"
              :options="filteredMenuOptions"
              :expand-icon="expandIcon"
              :indent="12"
              @update:value="handleMenuUpdate"
            />
          </div>
        </n-layout-sider>

        <n-layout class="!bg-slate-50 min-h-screen">
          <div class="container mx-auto px-4 md:px-8 py-6 pb-[120px] md:pb-6">
            <router-view v-slot="{ Component, route }">
              <keep-alive>
                <component :is="Component" :key="getRouteKey(route)" />
              </keep-alive>
            </router-view>
          </div>

          <BottomAppBar class="md:hidden"></BottomAppBar>
        </n-layout>
      </n-layout>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>
<script setup lang="ts">
import { NMessageProvider, NDialogProvider, NConfigProvider, NLayout, NMenu, NLayoutSider, NIcon, NBadge } from 'naive-ui';
import { ruRU, dateRuRU } from 'naive-ui';
import { computed, h, onMounted, ref } from 'vue'
import type { Component } from 'vue'

//@ts-ignore
import { CaretDownOutline } from '@vicons/ionicons5';

import {CogIcon, ShoppingCartIcon, InboxIcon, UsersIcon, UserIcon,
  ShoppingBagIcon, QuestionMarkCircleIcon} from '@heroicons/vue/24/outline';
import { RouterLink, useRoute, useRouter } from "vue-router";
import Logo from "@/assets/new-logo.png";
import Avatar from "@/components/Avatar.vue";
import BottomAppBar from './components/BottomAppBar.vue';
import axiosIns from "@/apis";
import { useAuthStore } from '@/stores/auth-store';

const route = useRoute();
const router = useRouter();


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
  Menu: {
    itemTextColorActive: '#1e293b',
    itemTextColorActiveHover: '#1e293b',
    itemIconColorActive: '#FFBF00',
    itemIconColorActiveHover: '#FFBF00',
    itemColorActive: 'rgba(255, 191, 0, 0.12)',
    itemColorActiveHover: 'rgba(255, 191, 0, 0.18)',
    itemTextColorHover: '#334155',
    itemIconColorHover: '#64748b',
    itemColorHover: 'rgba(100, 116, 135, 0.08)',
    borderRadius: '12px',
    itemHeight: '52px',
    itemIconSize: '24px',
    itemMarginBottom: '6px'
  }
}

const authStore = useAuthStore();

// Вычисляем активный ключ меню на основе текущего роута
const activeKey = computed(() => {
  const name = route.name as string;
  // Для detail страниц возвращаем базовое имя (без -detail)
  if (name?.includes('-detail')) {
    return name.replace('-detail', '-list');
  }
  return name;
});

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

// Обработчик выбора пункта меню
function handleMenuUpdate(key: string) {
  // Если выбран текущий активный пункт, не делаем ничего
  if (key === activeKey.value) {
    return;
  }
  // Переход на выбранную страницу
  router.push({ name: key });
}

const menuOptions = ref([
  {
    label: 'Запчасти',
    key: 'parts-list',
    icon: renderIcon(CogIcon),
    roles: ["all", "Директор"] as string[]
  },
  {
    label: 'Заказы',
    key: 'orders-list',
    icon: renderIcon(ShoppingCartIcon),
    roles: ["all", "Директор"] as string[]
  },
  {
    label: 'Заказы в процессе',
    key: 'orders-list-in-progress',
    icon: renderOrdersInProgressIcon(ShoppingBagIcon),
    roles: ["all", "Директор"] as string[]
  },
  {
    type: 'divider',
    key: 'divider-1',
    roles: ["Директор"] as string[]
  },
  {
    label: 'Склады',
    key: 'warehouses-list',
    icon: renderIcon(InboxIcon),
    roles: ["Директор"] as string[]
  },
  {
    label: 'Клиенты',
    key: 'clients-list',
    icon: renderIcon(UsersIcon),
    roles: ["Директор"] as string[]
  },
  {
    type: 'divider',
    key: 'divider-2',
    roles: ["all"] as string[]
  },
  {
    label: 'Профиль',
    key: 'profile',
    icon: renderIcon(UserIcon),
    roles: ["all"] as string[]
  },
  {
    label: 'Заявки',
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