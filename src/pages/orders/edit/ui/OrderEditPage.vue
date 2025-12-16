<template>
  <div class="order-edit-page">
    <n-page-header @back="handleBack">
      <template #title>
        Редактировать заказ #{{ orderId }}
      </template>
    </n-page-header>

    <div class="content">
      <n-card v-if="orderStore.isLoading">
        <n-skeleton :repeat="5" />
      </n-card>

      <n-card v-else-if="orderStore.order">
        <n-space vertical>
          <n-alert type="info">
            Функция редактирования заказа в разработке
          </n-alert>

          <n-descriptions bordered :column="2">
            <n-descriptions-item label="Номер заказа">
              {{ orderStore.order.orderNumber }}
            </n-descriptions-item>
            <n-descriptions-item label="Статус">
              {{ orderStore.order.status }}
            </n-descriptions-item>
            <n-descriptions-item label="Клиент">
              {{ orderStore.order.client?.firstName }} {{ orderStore.order.client?.lastName }}
            </n-descriptions-item>
            <n-descriptions-item label="Сумма">
              {{ orderStore.order.totalAmount }} ₸
            </n-descriptions-item>
          </n-descriptions>

          <n-space>
            <n-button @click="handleBack">Отмена</n-button>
            <n-button type="primary" disabled>
              Сохранить
            </n-button>
          </n-space>
        </n-space>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NPageHeader,
  NCard,
  NSkeleton,
  NSpace,
  NAlert,
  NDescriptions,
  NDescriptionsItem,
  NButton
} from 'naive-ui'
import { useOrderStore } from '@entities/order'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const orderId = computed(() => Number(route.params.id))

onMounted(() => {
  orderStore.loadOrder(orderId.value)
})

function handleBack() {
  router.back()
}
</script>

<style scoped>
.order-edit-page {
  padding: 16px;
}

.content {
  max-width: 1000px;
  margin: 24px auto 0;
}
</style>
