<template>
  <section class="space-y-4 pb-10">
    <n-breadcrumb class="mb-2">
      <n-breadcrumb-item>
        <router-link to="/" class="text-slate-600 hover:text-slate-900 transition-colors">
          Главная
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        <span class="text-slate-900 font-medium">Заказы</span>
      </n-breadcrumb-item>
    </n-breadcrumb>

    <OrdersTable title="Заказы" subtitle="Управление заказами и статусами клиентов" />
  </section>
</template>

<script setup lang="ts">
import { NBreadcrumb, NBreadcrumbItem } from 'naive-ui';
import OrdersTable from '@/components/Orders/OrdersTable.vue';
</script>
