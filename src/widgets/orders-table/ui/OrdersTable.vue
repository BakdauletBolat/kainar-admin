<template>
  <div class="orders-table">
    <n-space vertical>
      <n-space justify="space-between">
        <n-space>
          <n-button-group>
            <n-button
              :type="filterStatus === 'all' ? 'primary' : 'default'"
              @click="handleFilterChange('all')"
            >
              Все
            </n-button>
            <n-button
              :type="filterStatus === 'pending' ? 'primary' : 'default'"
              @click="handleFilterChange('pending')"
            >
              В ожидании
            </n-button>
            <n-button
              :type="filterStatus === 'confirmed' ? 'primary' : 'default'"
              @click="handleFilterChange('confirmed')"
            >
              Подтверждено
            </n-button>
            <n-button
              :type="filterStatus === 'cancelled' ? 'primary' : 'default'"
              @click="handleFilterChange('cancelled')"
            >
              Отменено
            </n-button>
          </n-button-group>
        </n-space>
        <n-button type="primary" @click="emit('create')">
          Создать заказ
        </n-button>
      </n-space>

      <n-data-table
        :columns="columns"
        :data="filteredOrders"
        :loading="orderStore.isLoadingOrders"
        :row-key="(row) => row.id"
        :pagination="paginationReactive"
        :bordered="false"
      />
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { h, reactive, computed, ref } from 'vue'
import { NSpace, NButton, NButtonGroup, NDataTable, NTag } from 'naive-ui'
import { useOrderStore } from '@entities/order'
import { useConfirmOrder } from '@features/order/confirm-order'
import { useCancelOrder } from '@features/order/cancel-order'
import { useConfirmPayment } from '@features/order/confirm-payment'
import { ordersTableColumns } from '../lib/columns'
import type { DataTableColumns } from 'naive-ui'
import type { Order } from '@entities/order'

const emit = defineEmits<{
  create: []
  view: [id: number]
}>()

const orderStore = useOrderStore()
const { confirmOrder } = useConfirmOrder()
const { cancelOrder } = useCancelOrder()
const { confirmPayment } = useConfirmPayment()

const filterStatus = ref<'all' | 'pending' | 'confirmed' | 'cancelled'>('all')

const paginationReactive = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  onChange: (page: number) => {
    paginationReactive.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
  }
})

const filteredOrders = computed(() => {
  if (filterStatus.value === 'all') {
    return orderStore.orders
  }
  return orderStore.orders.filter(order => order.status === filterStatus.value)
})

const columns: DataTableColumns<Order> = [
  ...ordersTableColumns.map(col => {
    if (col.key === 'status') {
      return {
        ...col,
        render: (row: Order) => {
          const statusMap: Record<string, { label: string; type: 'success' | 'warning' | 'error' | 'info' }> = {
            pending: { label: 'В ожидании', type: 'warning' },
            confirmed: { label: 'Подтверждено', type: 'success' },
            cancelled: { label: 'Отменено', type: 'error' },
            completed: { label: 'Завершено', type: 'info' }
          }
          const status = statusMap[row.status] || { label: row.status, type: 'default' }
          return h(NTag, { type: status.type }, { default: () => status.label })
        }
      }
    }
    if (col.key === 'paymentStatus') {
      return {
        ...col,
        render: (row: Order) => {
          const statusMap: Record<string, { label: string; type: 'success' | 'warning' | 'error' }> = {
            paid: { label: 'Оплачено', type: 'success' },
            pending: { label: 'Ожидает оплаты', type: 'warning' },
            refunded: { label: 'Возвращено', type: 'error' }
          }
          const status = statusMap[row.paymentStatus] || { label: row.paymentStatus, type: 'default' }
          return h(NTag, { type: status.type }, { default: () => status.label })
        }
      }
    }
    if (col.key === 'actions') {
      return {
        ...col,
        render: (row: Order) => {
          return h(NSpace, {}, {
            default: () => [
              h(NButton, {
                size: 'small',
                onClick: () => emit('view', row.id)
              }, { default: () => 'Просмотр' }),
              row.status === 'pending' && h(NButton, {
                size: 'small',
                type: 'success',
                onClick: async () => {
                  const success = await confirmOrder(row.id)
                  if (success) await orderStore.loadOrders()
                }
              }, { default: () => 'Подтвердить' }),
              row.status === 'pending' && h(NButton, {
                size: 'small',
                type: 'error',
                onClick: async () => {
                  const success = await cancelOrder(row.id)
                  if (success) await orderStore.loadOrders()
                }
              }, { default: () => 'Отменить' }),
              row.status === 'confirmed' && row.paymentStatus === 'pending' && h(NButton, {
                size: 'small',
                type: 'primary',
                onClick: async () => {
                  const success = await confirmPayment(row.id)
                  if (success) await orderStore.loadOrders()
                }
              }, { default: () => 'Подтвердить оплату' })
            ].filter(Boolean)
          })
        }
      }
    }
    if (col.key === 'client.name') {
      return {
        ...col,
        render: (row: Order) => row.client?.name || '-'
      }
    }
    if (col.key === 'total_price') {
      return {
        ...col,
        render: (row: Order) => `${row.total_price} ₸`
      }
    }
    return col
  })
]

function handleFilterChange(status: typeof filterStatus.value) {
  filterStatus.value = status
  paginationReactive.page = 1
}
</script>

<style scoped>
.orders-table {
  width: 100%;
}
</style>
