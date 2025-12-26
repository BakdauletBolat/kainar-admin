<template>
  <div class="space-y-6">
    <!-- Заголовок -->
    <div class="rounded-3xl border border-slate-200/80 bg-white px-6 py-5 shadow-sm">
      <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Главный экран</p>
          <h1 class="text-3xl font-bold text-slate-900">Панель управления</h1>
          <p class="text-slate-600 mt-1">Обзор ключевых показателей и быстрый доступ к разделам</p>
          <div class="mt-3 flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700 ring-1 ring-amber-100">
              <n-icon :component="TimeOutline" :size="18" class="text-amber-600" />
              В процессе: {{ dashboardInfo.orders_inprogress_count }}
            </span>
            <span class="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 ring-1 ring-blue-100">
              <n-icon :component="CartOutline" :size="18" class="text-blue-600" />
              Всего заказов: {{ dashboardInfo.orders_count }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Статистические карточки -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      <!-- Карточка: Всего заказов -->
      <router-link :to="{ name: 'orders-list' }" class="block h-full">
        <div class="flex h-full min-h-[188px] flex-col justify-between rounded-3xl border border-slate-200/80 bg-white px-6 py-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div class="flex items-start justify-between gap-3">
            <p class="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-500">Всего заказов</p>
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 ring-1 ring-blue-100">
              <n-icon :component="CartOutline" :size="26" class="text-blue-600" />
            </div>
          </div>
          <div class="space-y-3">
            <p class="text-4xl font-black tracking-tight text-slate-900 leading-none">{{ dashboardInfo.orders_count }}</p>
            <div class="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-[0.12em] text-blue-700">
              <span>Перейти к заказам</span>
              <n-icon :component="ArrowForwardOutline" :size="16" />
            </div>
          </div>
        </div>
      </router-link>

      <!-- Карточка: Заказы в процессе -->
      <router-link :to="{ name: 'orders-list-in-progress' }" class="block h-full">
        <div class="flex h-full min-h-[188px] flex-col justify-between rounded-3xl border border-slate-200/80 bg-white px-6 py-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div class="flex items-start justify-between gap-3">
            <p class="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-500">Заказы в процессе</p>
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 ring-1 ring-amber-100">
              <n-icon :component="TimeOutline" :size="26" class="text-amber-600" />
            </div>
          </div>
          <div class="space-y-3">
            <p class="text-4xl font-black tracking-tight text-slate-900 leading-none">{{ dashboardInfo.orders_inprogress_count }}</p>
            <div class="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-[0.12em] text-amber-700">
              <span>Активные заказы</span>
              <n-icon :component="ArrowForwardOutline" :size="16" />
            </div>
          </div>
        </div>
      </router-link>

      <!-- Карточка: Запчасти -->
      <router-link :to="{ name: 'parts-list' }" class="block h-full">
        <div class="flex h-full min-h-[188px] flex-col justify-between rounded-3xl border border-slate-200/80 bg-white px-6 py-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div class="flex items-start justify-between gap-3">
            <p class="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-500">Запчасти</p>
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 ring-1 ring-purple-100">
              <n-icon :component="ConstructOutline" :size="26" class="text-purple-600" />
            </div>
          </div>
          <div class="space-y-3">
            <p class="text-4xl font-black tracking-tight text-slate-900 leading-none">{{ dashboardInfo.parts_count }}</p>
            <div class="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-[0.12em] text-purple-700">
              <span>Каталог запчастей</span>
              <n-icon :component="ArrowForwardOutline" :size="16" />
            </div>
          </div>
        </div>
      </router-link>

      <!-- Карточка: Продажи за сегодня -->
      <div class="flex h-full min-h-[188px] flex-col justify-between rounded-3xl border border-slate-200/80 bg-white px-6 py-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div class="flex items-start justify-between gap-3">
          <p class="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-500">Продажи за сегодня</p>
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 ring-1 ring-green-100">
            <n-icon :component="TrendingUpOutline" :size="26" class="text-green-600" />
          </div>
        </div>
        <div class="space-y-3">
          <p class="text-4xl font-black tracking-tight text-slate-900 leading-none">{{ formatCurrency(dashboardInfo.sale_for_today) }}</p>
          <p class="text-sm font-medium text-slate-600">Обновлено только что</p>
        </div>
      </div>
    </div>

    <!-- Быстрые действия -->
    <div class="rounded-3xl border border-slate-200/80 bg-white px-6 py-5 shadow-sm">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <h2 class="text-2xl font-semibold text-slate-900">Быстрые действия</h2>
        <p class="text-sm text-slate-500">Частые операции в один клик</p>
      </div>
      <div class="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <router-link :to="{ name: 'parts-create' }">
          <n-button
            type="primary"
            round
            size="large"
            block
            class="font-semibold !h-[52px]"
          >
            <template #icon>
              <n-icon :component="AddCircleOutline" :size="22" />
            </template>
            Добавить запчасть
          </n-button>
        </router-link>

        <router-link :to="{ name: 'orders-create' }">
          <n-button
            tertiary
            round
            size="large"
            block
            class="font-semibold !h-[52px] !text-slate-800 !border-slate-200"
          >
            <template #icon>
              <n-icon :component="CartOutline" :size="22" />
            </template>
            Создать заказ
          </n-button>
        </router-link>

        <router-link :to="{ name: 'clients-list' }" v-if="authStore.hasAnyRole(['Директор'])">
          <n-button
            tertiary
            round
            size="large"
            block
            class="font-semibold !h-[52px] !text-slate-800 !border-slate-200"
          >
            <template #icon>
              <n-icon :component="PeopleOutline" :size="22" />
            </template>
            Клиенты
          </n-button>
        </router-link>

        <router-link :to="{ name: 'warehouses-list' }" v-if="authStore.hasAnyRole(['Директор'])">
          <n-button
            tertiary
            round
            size="large"
            block
            class="font-semibold !h-[52px] !text-slate-800 !border-slate-200"
          >
            <template #icon>
              <n-icon :component="CubeOutline" :size="22" />
            </template>
            Склады
          </n-button>
        </router-link>
      </div>
    </div>

    <!-- Дополнительные секции -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <!-- Быстрый доступ к разделам -->
      <div class="rounded-3xl border border-slate-200/80 bg-white px-5 py-4 shadow-sm">
        <div class="flex items-center justify-between pb-3">
          <h3 class="text-xl font-semibold text-slate-900">Основные разделы</h3>
          <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Навигация</span>
        </div>
        <div class="space-y-2">
          <router-link :to="{ name: 'parts-list' }">
            <div class="flex items-center justify-between rounded-2xl px-4 py-3 transition-colors hover:bg-slate-50">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 ring-1 ring-purple-100">
                  <n-icon :component="ConstructOutline" :size="20" class="text-purple-700" />
                </div>
                <span class="font-semibold text-slate-900">Запчасти</span>
              </div>
              <n-icon :component="ChevronForwardOutline" :size="20" class="text-slate-400" />
            </div>
          </router-link>

          <router-link :to="{ name: 'orders-list' }">
            <div class="flex items-center justify-between rounded-2xl px-4 py-3 transition-colors hover:bg-slate-50">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 ring-1 ring-blue-100">
                  <n-icon :component="CartOutline" :size="20" class="text-blue-700" />
                </div>
                <span class="font-semibold text-slate-900">Заказы</span>
              </div>
              <n-icon :component="ChevronForwardOutline" :size="20" class="text-slate-400" />
            </div>
          </router-link>

          <router-link :to="{ name: 'orders-list-in-progress' }">
            <div class="flex items-center justify-between rounded-2xl px-4 py-3 transition-colors hover:bg-slate-50">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 ring-1 ring-amber-100">
                  <n-icon :component="TimeOutline" :size="20" class="text-amber-700" />
                </div>
                <span class="font-semibold text-slate-900">Заказы в процессе</span>
              </div>
              <span class="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
                {{ dashboardInfo.orders_inprogress_count }}
              </span>
            </div>
          </router-link>

          <router-link :to="{ name: 'feedbacks-list' }">
            <div class="flex items-center justify-between rounded-2xl px-4 py-3 transition-colors hover:bg-slate-50">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 ring-1 ring-slate-200/80">
                  <n-icon :component="ChatbubbleOutline" :size="20" class="text-slate-700" />
                </div>
                <span class="font-semibold text-slate-900">Заявки</span>
              </div>
              <n-icon :component="ChevronForwardOutline" :size="20" class="text-slate-400" />
            </div>
          </router-link>
        </div>
      </div>

      <!-- Справочная информация -->
      <div class="rounded-3xl border border-slate-200/80 bg-white px-5 py-4 shadow-sm">
        <div class="flex items-center justify-between pb-3">
          <h3 class="text-xl font-semibold text-slate-900">Полезная информация</h3>
          <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Подсказки</span>
        </div>
        <div class="space-y-3">
          <div class="flex gap-3 rounded-2xl bg-blue-50 px-4 py-3 ring-1 ring-blue-100">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/60">
              <n-icon :component="InformationCircleOutline" :size="22" class="text-blue-700" />
            </div>
            <div class="space-y-1">
              <h4 class="font-semibold text-blue-900">Система управления</h4>
              <p class="text-sm text-blue-800">Управляйте запчастями, заказами и складами в одном месте</p>
            </div>
          </div>

          <div class="flex gap-3 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200/80">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/70">
              <n-icon :component="HelpCircleOutline" :size="22" class="text-slate-700" />
            </div>
            <div class="space-y-1">
              <h4 class="font-semibold text-slate-900">Нужна помощь?</h4>
              <p class="text-sm text-slate-600">Обратитесь к администратору системы</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { NButton, NIcon } from 'naive-ui';
import {
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
import axiosIns from '@/shared/api/axios';
import { useUserStore as useAuthStore } from '@entities/user';

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
