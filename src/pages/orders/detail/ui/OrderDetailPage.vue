<template>
  <div class="order-detail-page">
    <n-page-header :title="`Заказ #${orderId}`" @back="router.back()">
      <template #extra>
        <n-space>
          <n-button
            v-if="orderStore.order?.status === 'pending'"
            type="success"
            @click="handleConfirm"
          >
            Подтвердить
          </n-button>
          <n-button
            v-if="orderStore.order?.status === 'pending'"
            type="error"
            @click="handleCancel"
          >
            Отменить
          </n-button>
          <n-button
            v-if="orderStore.order?.status === 'confirmed' && orderStore.order?.paymentStatus === 'pending'"
            type="primary"
            @click="handleConfirmPayment"
          >
            Подтвердить оплату
          </n-button>
        </n-space>
      </template>
    </n-page-header>

    <n-spin :show="orderStore.isLoadingOrders">
      <n-card v-if="orderStore.order" class="detail-card">
        <n-descriptions label-placement="left" :column="2" bordered>
          <n-descriptions-item label="UUID">
            {{ orderStore.order.uuid }}
          </n-descriptions-item>
          <n-descriptions-item label="Статус">
            <n-tag :type="getStatusType(orderStore.order.status)">
              {{ orderStore.order.status }}
            </n-tag>
          </n-descriptions-item>
          <n-descriptions-item label="Статус оплаты">
            <n-tag :type="getPaymentStatusType(orderStore.order.paymentStatus)">
              {{ orderStore.order.paymentStatus }}
            </n-tag>
          </n-descriptions-item>
          <n-descriptions-item label="Способ оплаты">
            {{ orderStore.order.paymentType }}
          </n-descriptions-item>
          <n-descriptions-item label="Клиент">
            {{ orderStore.order.firstName }} {{ orderStore.order.lastName }}
          </n-descriptions-item>
          <n-descriptions-item label="Телефон">
            {{ orderStore.order.phoneNumber }}
          </n-descriptions-item>
          <n-descriptions-item label="Email">
            {{ orderStore.order.email }}
          </n-descriptions-item>
          <n-descriptions-item label="Адрес">
            {{ orderStore.order.address || '-' }}
          </n-descriptions-item>
          <n-descriptions-item label="Склад">
            {{ orderStore.order.warehouse.name }}
          </n-descriptions-item>
          <n-descriptions-item label="Сумма">
            {{ orderStore.order.total }} ₸
          </n-descriptions-item>
          <n-descriptions-item label="Скидка">
            {{ orderStore.order.discount }}%
          </n-descriptions-item>
          <n-descriptions-item label="Комментарий" :span="2">
            {{ orderStore.order.comment || '-' }}
          </n-descriptions-item>
        </n-descriptions>

        <n-divider />

        <h3>Товары</h3>
        <n-list bordered>
          <n-list-item v-for="good in orderStore.order.goods" :key="good.id">
            <n-thing :title="good.product.name">
              <template #description>
                Категория: {{ good.product.category.name }}
              </template>
              Количество: {{ good.quantity }} x {{ good.product.price }} ₸
            </n-thing>
          </n-list-item>
        </n-list>
      </n-card>
    </n-spin>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { NPageHeader, NCard, NSpin, NDescriptions, NDescriptionsItem, NTag, NButton, NSpace, NDivider, NList, NListItem, NThing } from 'naive-ui'
import { useRouter, useRoute } from 'vue-router'
import { useOrderStore } from '@entities/order'
import { useConfirmOrder } from '@features/order/confirm-order'
import { useCancelOrder } from '@features/order/cancel-order'
import { useConfirmPayment } from '@features/order/confirm-payment'

const router = useRouter()
const route = useRoute()
const orderStore = useOrderStore()
const { confirmOrder } = useConfirmOrder()
const { cancelOrder } = useCancelOrder()
const { confirmPayment } = useConfirmPayment()

const orderId = computed(() => Number(route.params.id))

onMounted(() => {
  orderStore.setOrderId(orderId.value)
  orderStore.loadOrder()
})

function getStatusType(status: string): 'success' | 'warning' | 'error' | 'info' {
  const map: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
    pending: 'warning',
    confirmed: 'success',
    cancelled: 'error',
    completed: 'info'
  }
  return map[status] || 'default'
}

function getPaymentStatusType(status: string): 'success' | 'warning' | 'error' {
  const map: Record<string, 'success' | 'warning' | 'error'> = {
    paid: 'success',
    pending: 'warning',
    refunded: 'error'
  }
  return map[status] || 'default'
}

async function handleConfirm() {
  const success = await confirmOrder(orderId.value)
  if (success) {
    await orderStore.loadOrder()
  }
}

async function handleCancel() {
  const success = await cancelOrder(orderId.value)
  if (success) {
    await orderStore.loadOrder()
  }
}

async function handleConfirmPayment() {
  const success = await confirmPayment(orderId.value)
  if (success) {
    await orderStore.loadOrder()
  }
}
</script>

<style scoped>
.order-detail-page {
  padding: 24px;
}

.detail-card {
  margin-top: 24px;
  max-width: 1200px;
}
</style>
