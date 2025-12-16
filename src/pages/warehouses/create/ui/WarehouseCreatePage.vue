<template>
  <div class="warehouse-create-page">
    <n-page-header @back="handleBack">
      <template #title>Новый склад</template>
    </n-page-header>

    <div class="content">
      <n-card>
        <CreateWarehouseForm
          @success="handleSuccess"
          @cancel="handleBack"
        />
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { NPageHeader, NCard, useMessage } from 'naive-ui'
import { CreateWarehouseForm } from '@features/warehouse/create-warehouse'

const router = useRouter()
const message = useMessage()

function handleBack() {
  router.back()
}

function handleSuccess() {
  message.success('Склад успешно создан')
  router.push({ name: 'warehouses-list' })
}
</script>

<style scoped>
.warehouse-create-page {
  padding: 16px;
}

.content {
  max-width: 800px;
  margin: 24px auto 0;
}
</style>
