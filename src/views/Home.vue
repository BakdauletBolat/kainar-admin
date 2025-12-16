<template>
  <main class="space-y-8 pb-6">
    <section
      class="relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 backdrop-blur-2xl shadow-[0_20px_80px_rgba(15,23,42,0.12)]">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute left-10 top-2 h-28 w-28 rounded-full bg-[#dbeafe] blur-3xl"></div>
        <div class="absolute right-6 -bottom-10 h-32 w-32 rounded-full bg-[#ffe7c2] blur-3xl"></div>
      </div>
      <div class="relative z-10 flex flex-col gap-6 p-6 md:p-8">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div class="space-y-3">
            <div
              class="inline-flex items-center gap-2 rounded-full bg-slate-900/5 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-900/10">
              <SparklesIcon class="h-4 w-4 text-amber-500" />
              <span>Сфокусировано на важном</span>
            </div>
            <div class="space-y-2">
              <h1 class="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                {{ greetingText }}
              </h1>
              <p class="max-w-2xl text-base text-slate-600">
                Краткий взгляд на продажи, заказы и склады в одном месте. Все в духе Apple — чисто, спокойно, с
                акцентом на действия.
              </p>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <n-button quaternary round @click="goToSettings">Настроить дашборд</n-button>
            <n-button type="primary" strong round @click="goToCreateOrder">
              <template #icon>
                <n-icon>
                  <PlusIcon />
                </n-icon>
              </template>
              Создать заказ
            </n-button>
          </div>
        </div>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div v-for="stat in statCards" :key="stat.label"
            class="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/80 px-4 py-5 shadow-[0_14px_40px_rgba(15,23,42,0.1)] transition hover:-translate-y-[2px] hover:shadow-[0_18px_50px_rgba(15,23,42,0.14)]">
            <div class="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent"></div>
            <div class="relative z-10 flex items-center justify-between gap-2">
              <div class="flex items-center gap-3">
                <span
                  class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/5 text-slate-700 ring-1 ring-slate-900/10">
                  <component :is="stat.icon" class="h-5 w-5" />
                </span>
                <div class="space-y-1">
                  <p class="text-xs uppercase tracking-[0.06em] text-slate-500">{{ stat.label }}</p>
                  <div class="flex items-baseline gap-2">
                    <div class="text-2xl font-semibold text-slate-900">
                      <n-skeleton v-if="isLoadingStats" height="28px" width="64px" />
                      <span v-else>{{ stat.display }}</span>
                    </div>
                    <p v-if="stat.hint && !isLoadingStats" class="text-xs text-slate-500">{{ stat.hint }}</p>
                  </div>
                </div>
              </div>
              <n-tag size="small" round type="success" v-if="stat.trend && !isLoadingStats">
                {{ stat.trend }}
              </n-tag>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-5 lg:grid-cols-[2fr_1.2fr]">
      <div
        class="rounded-3xl border border-white/70 bg-white/80 px-6 py-5 backdrop-blur-2xl shadow-[0_18px_60px_rgba(15,23,42,0.12)]">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <p class="text-xs uppercase tracking-[0.08em] text-slate-500">Заказы в работе</p>
            <h2 class="text-xl font-semibold text-slate-900">Фокус на текущих задачах</h2>
          </div>
          <n-button text round size="small" @click="goToOrders">
            <template #icon>
              <n-icon>
                <ArrowRightCircleIcon />
              </n-icon>
            </template>
            Все заказы
          </n-button>
        </div>

        <div class="space-y-3">
          <div v-if="isLoadingOrders" class="space-y-3">
            <div v-for="idx in 3" :key="idx"
              class="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
              <n-skeleton height="18px" width="60%" />
              <n-skeleton height="14px" width="40%" class="mt-2" />
            </div>
          </div>
          <div v-else-if="activeOrders.length === 0"
            class="rounded-2xl border border-dashed border-slate-200 bg-white/60 px-4 py-6 text-sm text-slate-600">
            Нет заказов в процессе. Создайте новый или вернитесь позже.
          </div>
          <div v-else class="space-y-3">
            <article v-for="order in activeOrders" :key="order.id"
              class="flex flex-col gap-3 rounded-2xl border border-white/70 bg-white/80 px-4 py-4 shadow-[0_12px_36px_rgba(15,23,42,0.1)] transition hover:-translate-y-[2px] hover:shadow-[0_16px_48px_rgba(15,23,42,0.12)]">
              <div class="flex flex-wrap items-center gap-3">
                <span class="text-sm font-semibold text-slate-900">#{{ order.id }}</span>
                <n-tag :type="statusColor(order.status)" size="small" round>{{ order.status }}</n-tag>
                <n-tag :type="paymentColor(order.payment_status)" size="small" round>{{ order.payment_status }}</n-tag>
                <p class="text-xs text-slate-500">
                  Обновлено {{ timeAgoText(order.updated_at) }}
                </p>
              </div>
              <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div class="space-y-1">
                  <p class="text-base font-semibold text-slate-900">
                    {{ order.goods?.[0]?.product?.name ?? 'Без названия' }}
                  </p>
                  <p class="text-sm text-slate-600">
                    {{ order.goods?.length || 0 }} шт · {{ order.warehouse?.name ?? 'Склад не указан' }}
                  </p>
                </div>
                <div class="flex items-center gap-3">
                  <p class="text-lg font-semibold text-slate-900">{{ formatCurrency(order.total) }}</p>
                  <n-button text circle size="small" @click="openOrder(order.id)">
                    <template #icon>
                      <n-icon>
                        <ChevronRightIcon />
                      </n-icon>
                    </template>
                  </n-button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>

      <div class="space-y-5">
        <div
          class="rounded-3xl border border-white/70 bg-white/80 px-6 py-5 backdrop-blur-2xl shadow-[0_18px_60px_rgba(15,23,42,0.12)]">
          <div class="mb-3 flex items-center justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.08em] text-slate-500">Быстрые действия</p>
              <h2 class="text-lg font-semibold text-slate-900">Действия в один тап</h2>
            </div>
          </div>
          <div class="grid gap-3">
            <button v-for="action in quickActions" :key="action.label" type="button"
              class="group flex w-full items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-left shadow-[0_10px_32px_rgba(15,23,42,0.08)] transition hover:-translate-y-[1px] hover:shadow-[0_14px_40px_rgba(15,23,42,0.1)]"
              @click="action.onClick">
              <div class="flex items-center gap-3">
                <span
                  class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/5 text-slate-700 ring-1 ring-slate-900/10">
                  <component :is="action.icon" class="h-5 w-5" />
                </span>
                <div class="space-y-0.5">
                  <p class="text-sm font-semibold text-slate-900">{{ action.label }}</p>
                  <p class="text-xs text-slate-500">{{ action.description }}</p>
                </div>
              </div>
              <ArrowRightCircleIcon class="h-5 w-5 text-slate-400 transition group-hover:text-slate-600" />
            </button>
          </div>
        </div>

        <div
          class="rounded-3xl border border-white/70 bg-white/80 px-6 py-5 backdrop-blur-2xl shadow-[0_18px_60px_rgba(15,23,42,0.12)]">
          <div class="mb-3 flex items-center justify-between gap-3">
            <div>
              <p class="text-xs uppercase tracking-[0.08em] text-slate-500">Запасы</p>
              <h2 class="text-lg font-semibold text-slate-900">Состояние складов</h2>
            </div>
            <n-tag round size="small" type="info">живые данные</n-tag>
          </div>
          <div class="space-y-3">
            <div class="flex items-center justify-between text-sm text-slate-600">
              <span>Запчасти</span>
              <span class="font-semibold text-slate-900">{{ dashboardInfo?.parts_count ?? '—' }}</span>
            </div>
            <div class="flex items-center justify-between text-sm text-slate-600">
              <span>Заказы (все)</span>
              <span class="font-semibold text-slate-900">{{ dashboardInfo?.orders_count ?? '—' }}</span>
            </div>
            <div class="flex items-center justify-between text-sm text-slate-600">
              <span>Заказы в процессе</span>
              <span class="font-semibold text-slate-900">{{ dashboardInfo?.orders_inprogress_count ?? '—' }}</span>
            </div>
            <div class="flex items-center justify-between text-sm text-slate-600">
              <span>Продажи за сегодня</span>
              <span class="font-semibold text-slate-900">{{ formatCurrency(dashboardInfo?.sale_for_today || 0) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { NButton, NIcon, NTag, NSkeleton } from 'naive-ui';
import {
  ArrowRightCircleIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ClockIcon,
  PlusIcon,
  ShoppingCartIcon,
  SparklesIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/vue/24/outline';
import { BanknotesIcon } from '@heroicons/vue/24/solid';
import axiosIns from '@/apis';
import { useOrderStore } from '@/stores/order-store';
import { useAuthStore } from '@/stores/auth-store';
import { timeAgo } from '@/utils/formatDate';
import type Order from '@/apis/domain/order';

interface DashboardInfo {
  orders_count: number;
  orders_inprogress_count: number;
  parts_count: number;
  sale_for_today: number;
}

const router = useRouter();
const orderStore = useOrderStore();
const authStore = useAuthStore();

const dashboardInfo = ref<DashboardInfo | null>(null);
const isLoadingStats = ref(true);
const isLoadingOrders = ref(true);

const greetingText = computed(() => {
  const name = authStore.user?.first_name || 'Команда';
  return `Добро пожаловать, ${name}`;
});

const statCards = computed(() => {
  return [
    {
      label: 'Заказы',
      value: dashboardInfo.value?.orders_count ?? 0,
      display: formatNumber(dashboardInfo.value?.orders_count ?? 0),
      icon: ShoppingCartIcon,
      trend: 'обновлено',
      hint: 'все статусы',
    },
    {
      label: 'В процессе',
      value: dashboardInfo.value?.orders_inprogress_count ?? 0,
      display: formatNumber(dashboardInfo.value?.orders_inprogress_count ?? 0),
      icon: ClockIcon,
      trend: 'онлайн',
      hint: 'ожидают действий',
    },
    {
      label: 'Запчасти',
      value: dashboardInfo.value?.parts_count ?? 0,
      display: formatNumber(dashboardInfo.value?.parts_count ?? 0),
      icon: WrenchScrewdriverIcon,
      trend: 'активны',
      hint: 'на складе',
    },
    {
      label: 'Продажи за день',
      value: dashboardInfo.value?.sale_for_today ?? 0,
      display: formatCurrency(dashboardInfo.value?.sale_for_today ?? 0),
      icon: BanknotesIcon,
      trend: '',
      hint: 'KZT',
    },
  ];
});

const quickActions = computed(() => [
  {
    label: 'Создать заказ',
    description: 'Оформление продажи за пару шагов.',
    icon: ShoppingCartIcon,
    onClick: () => goToCreateOrder(),
    roles: ['all'],
  },
  {
    label: 'Добавить запчасть',
    description: 'Пополнить каталог и склад.',
    icon: WrenchScrewdriverIcon,
    onClick: () => router.push({ name: 'parts-create' }),
    roles: ['all'],
  },
  {
    label: 'Перейти к складам',
    description: 'Контроль остатков и логистики.',
    icon: CheckCircleIcon,
    onClick: () => router.push({ name: 'warehouses-list' }),
    roles: ['Директор'],
  },
  {
    label: 'Аналитика продаж',
    description: 'Как движется день по продажам.',
    icon: ChartBarIcon,
    onClick: () => router.push({ name: 'orders-list' }),
    roles: ['all'],
  },
].filter((action) => !action.roles || authStore.hasAnyRole(action.roles as string[])));

const activeOrders = computed<Order[]>(() => orderStore.ordersInProgress.slice(0, 4));

const loadDashboard = async () => {
  isLoadingStats.value = true;
  try {
    const response = await axiosIns.get('/api/admin/dashboard-info/');
    dashboardInfo.value = response.data;
  } finally {
    isLoadingStats.value = false;
  }
};

const loadOrders = async () => {
  isLoadingOrders.value = true;
  try {
    await orderStore.loadOrdersInProgress({ page: 1, page_size: 4, status: 1 });
  } finally {
    isLoadingOrders.value = false;
  }
};

onMounted(async () => {
  await Promise.all([loadDashboard(), loadOrders()]);
});

const goToCreateOrder = () => {
  router.push({ name: 'orders-create' });
};

const goToOrders = () => {
  router.push({ name: 'orders-list' });
};

const goToSettings = () => {
  router.push({ name: 'profile' });
};

const openOrder = (id: number) => {
  router.push({ name: 'orders-detail', params: { id } });
};

function statusColor(status: string) {
  if (status === 'В процессе') return 'warning';
  if (status === 'Отменен') return 'error';
  return 'success';
}

function paymentColor(status: string) {
  if (status === 'В ожидании') return 'warning';
  if (status === 'Отклонен') return 'error';
  return 'success';
}

function timeAgoText(date: string) {
  return timeAgo(new Date(date));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('ru-RU').format(value);
}

function formatCurrency(value: number | string) {
  const numeric = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(numeric) + ' ₸';
}
</script>
