<template>
  <div class="warehouse-edit-page">
    <n-page-header @back="handleBack">
      <template #title>
        Редактировать склад #{{ warehouseId }}
      </template>
    </n-page-header>

    <div class="content">
      <n-card v-if="warehouseStore.isLoading">
        <n-skeleton :repeat="5" />
      </n-card>

      <n-card v-else>
        <EditWarehouseForm
          :warehouse-id="warehouseId"
          @success="handleSuccess"
          @cancel="handleBack"
        />
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NPageHeader, NCard, NSkeleton, useMessage } from 'naive-ui'
import { EditWarehouseForm } from '@features/warehouse/edit-warehouse'
import { useWarehouseStore } from '@entities/warehouse'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const warehouseStore = useWarehouseStore()

const warehouseId = computed(() => Number(route.params.id))

onMounted(() => {
  warehouseStore.loadWarehouse(warehouseId.value)
})

function handleBack() {
  router.back()
}

function handleSuccess() {
  message.success('Склад успешно обновлен')
  router.push({ name: 'warehouses-detail', params: { id: warehouseId.value } })
}
</script>

<style scoped>
.warehouse-edit-page {
  padding: 16px;
}

.content {
  max-width: 800px;
  margin: 24px auto 0;
}
</style>
