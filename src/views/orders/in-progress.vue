<template>
  <OrdersTable title="Заказы в процессе" :status-filter="1" />
</template>

<script setup lang="ts">
import OrdersTable from '@/components/Orders/OrdersTable.vue';
</script>
