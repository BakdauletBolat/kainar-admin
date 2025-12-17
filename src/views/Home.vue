<template>
  <div class="space-y-6">
    <!-- Заголовок -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900">Панель управления</h1>
      <p class="text-slate-500 mt-2">Обзор основных показателей и быстрый доступ</p>
    </div>

    <!-- Статистические карточки -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Карточка: Всего заказов -->
      <router-link :to="{ name: 'orders-list' }">
        <n-card
          hoverable
          class="cursor-pointer transition-all duration-200 hover:shadow-lg border-2 border-transparent hover:border-primary-500"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-sm font-medium text-slate-600 mb-1">Всего заказов</p>
              <p class="text-3xl font-bold text-slate-900">{{ dashboardInfo.orders_count }}</p>
            </div>
            <div class="rounded-full bg-blue-100 p-3">
              <n-icon :component="ShoppingCartOutline" :size="28" class="text-blue-600" />
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm text-blue-600">
            <span>Перейти к заказам</span>
            <n-icon :component="ArrowForwardOutline" :size="16" class="ml-1" />
          </div>
        </n-card>
      </router-link>

      <!-- Карточка: Заказы в процессе -->
      <router-link :to="{ name: 'orders-list-in-progress' }">
        <n-card
          hoverable
          class="cursor-pointer transition-all duration-200 hover:shadow-lg border-2 border-transparent hover:border-primary-500"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-sm font-medium text-slate-600 mb-1">В процессе</p>
              <p class="text-3xl font-bold text-slate-900">{{ dashboardInfo.orders_inprogress_count }}</p>
            </div>
            <div class="rounded-full bg-amber-100 p-3">
              <n-icon :component="TimeOutline" :size="28" class="text-amber-600" />
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm text-amber-600">
            <span>Активные заказы</span>
            <n-icon :component="ArrowForwardOutline" :size="16" class="ml-1" />
          </div>
        </n-card>
      </router-link>

      <!-- Карточка: Запчасти -->
      <router-link :to="{ name: 'parts-list' }">
        <n-card
          hoverable
          class="cursor-pointer transition-all duration-200 hover:shadow-lg border-2 border-transparent hover:border-primary-500"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-sm font-medium text-slate-600 mb-1">Запчасти</p>
              <p class="text-3xl font-bold text-slate-900">{{ dashboardInfo.parts_count }}</p>
            </div>
            <div class="rounded-full bg-purple-100 p-3">
              <n-icon :component="ConstructOutline" :size="28" class="text-purple-600" />
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm text-purple-600">
            <span>Каталог запчастей</span>
            <n-icon :component="ArrowForwardOutline" :size="16" class="ml-1" />
          </div>
        </n-card>
      </router-link>

      <!-- Карточка: Продажи за сегодня -->
      <n-card class="border-2 border-slate-200">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="text-sm font-medium text-slate-600 mb-1">Продажи за сегодня</p>
            <p class="text-3xl font-bold text-slate-900">{{ formatCurrency(dashboardInfo.sale_for_today) }}</p>
          </div>
          <div class="rounded-full bg-green-100 p-3">
            <n-icon :component="TrendingUpOutline" :size="28" class="text-green-600" />
          </div>
        </div>
        <div class="mt-4 text-sm text-slate-500">
          <span>Обновлено только что</span>
        </div>
      </n-card>
    </div>

    <!-- Быстрые действия -->
    <div class="mt-8">
      <h2 class="text-xl font-semibold text-slate-900 mb-4">Быстрые действия</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <router-link :to="{ name: 'parts-create' }">
          <n-button
            type="primary"
            size="large"
            block
            class="!h-16"
          >
            <template #icon>
              <n-icon :component="AddCircleOutline" :size="24" />
            </template>
            <span class="text-base">Добавить запчасть</span>
          </n-button>
        </router-link>

        <router-link :to="{ name: 'orders-create' }">
          <n-button
            secondary
            type="primary"
            size="large"
            block
            class="!h-16"
          >
            <template #icon>
              <n-icon :component="CartOutline" :size="24" />
            </template>
            <span class="text-base">Создать заказ</span>
          </n-button>
        </router-link>

        <router-link :to="{ name: 'clients-list' }" v-if="authStore.hasAnyRole(['Директор'])">
          <n-button
            secondary
            type="info"
            size="large"
            block
            class="!h-16"
          >
            <template #icon>
              <n-icon :component="PeopleOutline" :size="24" />
            </template>
            <span class="text-base">Клиенты</span>
          </n-button>
        </router-link>

        <router-link :to="{ name: 'warehouses-list' }" v-if="authStore.hasAnyRole(['Директор'])">
          <n-button
            secondary
            type="warning"
            size="large"
            block
            class="!h-16"
          >
            <template #icon>
              <n-icon :component="CubeOutline" :size="24" />
            </template>
            <span class="text-base">Склады</span>
          </n-button>
        </router-link>
      </div>
    </div>

    <!-- Дополнительные секции -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      <!-- Быстрый доступ к разделам -->
      <n-card title="Основные разделы" :bordered="true">
        <div class="space-y-2">
          <router-link :to="{ name: 'parts-list' }">
            <div class="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
              <div class="flex items-center gap-3">
                <n-icon :component="ConstructOutline" :size="20" class="text-slate-600" />
                <span class="font-medium text-slate-900">Запчасти</span>
              </div>
              <n-icon :component="ChevronForwardOutline" :size="20" class="text-slate-400" />
            </div>
          </router-link>

          <router-link :to="{ name: 'orders-list' }">
            <div class="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
              <div class="flex items-center gap-3">
                <n-icon :component="ShoppingCartOutline" :size="20" class="text-slate-600" />
                <span class="font-medium text-slate-900">Заказы</span>
              </div>
              <n-icon :component="ChevronForwardOutline" :size="20" class="text-slate-400" />
            </div>
          </router-link>

          <router-link :to="{ name: 'orders-list-in-progress' }">
            <div class="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
              <div class="flex items-center gap-3">
                <n-icon :component="TimeOutline" :size="20" class="text-slate-600" />
                <span class="font-medium text-slate-900">Заказы в процессе</span>
              </div>
              <span class="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                {{ dashboardInfo.orders_inprogress_count }}
              </span>
            </div>
          </router-link>

          <router-link :to="{ name: 'feedbacks-list' }">
            <div class="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
              <div class="flex items-center gap-3">
                <n-icon :component="ChatbubbleOutline" :size="20" class="text-slate-600" />
                <span class="font-medium text-slate-900">Заявки</span>
              </div>
              <n-icon :component="ChevronForwardOutline" :size="20" class="text-slate-400" />
            </div>
          </router-link>
        </div>
      </n-card>

      <!-- Справочная информация -->
      <n-card title="Полезная информация" :bordered="true">
        <div class="space-y-4">
          <div class="p-4 bg-blue-50 rounded-lg">
            <div class="flex items-start gap-3">
              <n-icon :component="InformationCircleOutline" :size="24" class="text-blue-600 mt-0.5" />
              <div>
                <h4 class="font-semibold text-blue-900 mb-1">Система управления</h4>
                <p class="text-sm text-blue-700">Управляйте запчастями, заказами и складами в одном месте</p>
              </div>
            </div>
          </div>

          <div class="p-4 bg-slate-50 rounded-lg">
            <div class="flex items-start gap-3">
              <n-icon :component="HelpCircleOutline" :size="24" class="text-slate-600 mt-0.5" />
              <div>
                <h4 class="font-semibold text-slate-900 mb-1">Нужна помощь?</h4>
                <p class="text-sm text-slate-600">Обратитесь к администратору системы</p>
              </div>
            </div>
          </div>
        </div>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { NCard, NButton, NIcon } from 'naive-ui';
import {
  ShoppingCartOutline,
  TimeOutline,
  ConstructOutline,
  TrendingUpOutline,
  AddCircleOutline,
  CartOutline,
  PeopleOutline,
  CubeOutline,
  ArrowForwardOutline,
  ChevronForwardOutline,
  ChatbubbleOutline,
  InformationCircleOutline,
  HelpCircleOutline
} from '@vicons/ionicons5';
import axiosIns from '@/apis';
import { useAuthStore } from '@/stores/auth-store';

interface DashboardInfo {
  orders_count: number;
  orders_inprogress_count: number;
  parts_count: number;
  sale_for_today: number;
}

const authStore = useAuthStore();

const dashboardInfo = ref<DashboardInfo>({
  orders_inprogress_count: 0,
  orders_count: 0,
  parts_count: 0,
  sale_for_today: 0,
});

onMounted(async () => {
  try {
    const res = await axiosIns.get("/api/admin/dashboard-info/");
    dashboardInfo.value = res.data;
  } catch (e) {
    console.error('Failed to load dashboard info', e);
  }
});

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ru-KZ', {
    style: 'currency',
    currency: 'KZT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
</script>
