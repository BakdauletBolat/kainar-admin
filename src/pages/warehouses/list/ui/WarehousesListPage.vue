<template>
  <div class="warehouses-list-page">
    <n-page-header title="Склады">
      <template #subtitle>
        {{ warehouseStore.totalCount }}
      </template>
      <template #extra>
        <n-button type="primary" @click="handleCreate">
          <template #icon>
            <n-icon><AddOutline /></n-icon>
          </template>
          Создать склад
        </n-button>
      </template>
    </n-page-header>

    <div class="content">
      <WarehousesList @create="handleCreate" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NPageHeader, NButton, NIcon } from 'naive-ui'
import { AddOutline } from '@vicons/ionicons5'
import { WarehousesList } from '@widgets/warehouses-list'
import { useWarehouseStore } from '@entities/warehouse'

const router = useRouter()
const warehouseStore = useWarehouseStore()

onMounted(() => {
  warehouseStore.loadWarehouses()
})

function handleCreate() {
  router.push({ name: 'warehouses-create' })
}
</script>

<style scoped>
.warehouses-list-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  margin-top: 16px;
}
</style>
