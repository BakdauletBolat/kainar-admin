<template>
  <section class="space-y-4 pb-10">
    <n-breadcrumb class="mb-2">
      <n-breadcrumb-item>
        <router-link to="/" class="text-slate-600 hover:text-slate-900 transition-colors">
          Главная
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        <router-link
          :to="{ name: 'orders-list' }"
          class="text-slate-600 hover:text-slate-900 transition-colors"
        >
          Заказы
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        <span class="text-slate-900 font-medium">В процессе</span>
      </n-breadcrumb-item>
    </n-breadcrumb>

    <OrdersTable
      title="Заказы в процессе"
      subtitle="Активные заказы, ожидающие завершения"
      :status-filter="1"
    />
  </section>
</template>

<script setup lang="ts">
import { NBreadcrumb, NBreadcrumbItem } from 'naive-ui';
import OrdersTable from '@/components/Orders/OrdersTable.vue';
</script>
