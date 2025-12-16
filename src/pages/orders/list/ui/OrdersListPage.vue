<template>
  <div class="orders-list-page">
    <n-page-header title="Заказы">
      <template #extra>
        <n-button type="primary" @click="handleCreate">
          <template #icon>
            <n-icon><AddOutline /></n-icon>
          </template>
          Создать заказ
        </n-button>
      </template>
    </n-page-header>

    <n-card class="content-card">
      <OrdersTable
        @create="handleCreate"
        @view="handleView"
      />
    </n-card>

    <n-modal v-model:show="showCreateModal" preset="card" title="Создать заказ" style="width: 800px">
      <CreateOrderForm @success="handleCreateSuccess" @cancel="showCreateModal = false" />
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NPageHeader, NCard, NButton, NIcon, NModal } from 'naive-ui'
import { AddOutline } from '@vicons/ionicons5'
import { OrdersTable } from '@widgets/orders-table'
import { CreateOrderForm } from '@features/order/create-order'
import { useOrderStore } from '@entities/order'

const router = useRouter()
const orderStore = useOrderStore()

const showCreateModal = ref(false)

onMounted(() => {
  orderStore.loadOrders()
})

function handleCreate() {
  showCreateModal.value = true
}

function handleCreateSuccess() {
  showCreateModal.value = false
  orderStore.loadOrders()
}

function handleView(id: number) {
  router.push({ name: 'order-detail', params: { id } })
}
</script>

<style scoped>
.orders-list-page {
  padding: 24px;
}

.content-card {
  margin-top: 24px;
}
</style>
