<template>
  <div class="order-create-page">
    <n-page-header title="Создать заказ" @back="router.back()">
    </n-page-header>

    <n-card class="form-card">
      <CreateOrderForm @success="handleSuccess" @cancel="handleCancel" />
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NPageHeader, NCard } from 'naive-ui'
import { useRouter } from 'vue-router'
import { CreateOrderForm } from '@features/order/create-order'

const router = useRouter()

function handleSuccess() {
  router.push({ name: 'orders-list' })
}

function handleCancel() {
  router.back()
}
</script>

<style scoped>
.order-create-page {
  padding: 24px;
}

.form-card {
  margin-top: 24px;
  max-width: 800px;
}
</style>
