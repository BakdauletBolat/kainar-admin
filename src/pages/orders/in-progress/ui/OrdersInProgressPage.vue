<template>
  <div class="orders-in-progress-page">
    <n-page-header title="Заказы в работе">
    </n-page-header>

    <n-card class="content-card">
      <n-spin :show="orderStore.isLoadingOrders">
        <n-list v-if="orderStore.ordersInProgress.length" bordered>
          <n-list-item v-for="order in orderStore.ordersInProgress" :key="order.id">
            <template #prefix>
              <n-tag type="warning">{{ order.status }}</n-tag>
            </template>
            <n-thing :title="`Заказ #${order.id}`">
              <template #description>
                Клиент: {{ order.client }}
              </template>
              Сумма: {{ order.total }} ₸
            </n-thing>
            <template #suffix>
              <n-button @click="handleView(order.id)">
                Просмотр
              </n-button>
            </template>
          </n-list-item>
        </n-list>
        <n-empty v-else description="Нет заказов в работе" />
      </n-spin>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NPageHeader, NCard, NSpin, NList, NListItem, NThing, NTag, NButton, NEmpty } from 'naive-ui'
import { useOrderStore } from '@entities/order'

const router = useRouter()
const orderStore = useOrderStore()

onMounted(() => {
  orderStore.loadOrdersInProgress()
})

function handleView(id: number) {
  router.push({ name: 'order-detail', params: { id } })
}
</script>

<style scoped>
.orders-in-progress-page {
  padding: 24px;
}

.content-card {
  margin-top: 24px;
}
</style>
