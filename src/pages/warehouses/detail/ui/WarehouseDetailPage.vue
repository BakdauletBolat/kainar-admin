<template>
  <div class="warehouse-detail-page">
    <n-page-header @back="handleBack">
      <template #title>
        Склад #{{ warehouseId }}
      </template>
      <template #subtitle v-if="warehouseStore.warehouse">
        {{ warehouseStore.warehouse.name }}
      </template>
      <template #extra>
        <n-button @click="handleEdit">
          Редактировать
        </n-button>
      </template>
    </n-page-header>

    <div class="content">
      <n-card v-if="warehouseStore.isLoading">
        <n-skeleton :repeat="5" />
      </n-card>

      <n-card v-else-if="warehouseStore.warehouse">
        <n-descriptions bordered :column="2">
          <n-descriptions-item label="ID">
            {{ warehouseStore.warehouse.id }}
          </n-descriptions-item>
          <n-descriptions-item label="Название">
            {{ warehouseStore.warehouse.name }}
          </n-descriptions-item>
          <n-descriptions-item label="Город">
            {{ warehouseStore.warehouse.city?.name }}
          </n-descriptions-item>
          <n-descriptions-item label="Категории">
            {{ warehouseStore.warehouse.categories?.length || 0 }}
          </n-descriptions-item>
        </n-descriptions>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NPageHeader, NCard, NSkeleton, NDescriptions, NDescriptionsItem, NButton } from 'naive-ui'
import { useWarehouseStore } from '@entities/warehouse'

const route = useRoute()
const router = useRouter()
const warehouseStore = useWarehouseStore()

const warehouseId = computed(() => Number(route.params.id))

onMounted(() => {
  warehouseStore.loadWarehouse(warehouseId.value)
})

function handleBack() {
  router.back()
}

function handleEdit() {
  router.push({ name: 'warehouses-edit', params: { id: warehouseId.value } })
}
</script>

<style scoped>
.warehouse-detail-page {
  padding: 16px;
}

.content {
  max-width: 1000px;
  margin: 24px auto 0;
}
</style>
