<template>
  <div class="warehouses-list">
    <n-space vertical>
      <n-space justify="space-between">
        <n-text strong>Склады</n-text>
        <n-button type="primary" @click="emit('create')">
          Добавить склад
        </n-button>
      </n-space>

      <n-data-table
        :columns="columns"
        :data="warehouseStore.warehouses"
        :loading="warehouseStore.isLoading"
        :row-key="(row: Warehouse) => row.id"
        :pagination="paginationReactive"
        :bordered="false"
      />
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { h, reactive } from 'vue'
import { NSpace, NText, NButton, NDataTable } from 'naive-ui'
import { useWarehouseStore } from '@entities/warehouse'
import { warehousesListColumns } from '../lib/columns'
import type { DataTableColumns } from 'naive-ui'
import type { Warehouse } from '@entities/warehouse'

const emit = defineEmits<{
  create: []
  edit: [id: number | string]
}>()

const warehouseStore = useWarehouseStore()

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

const columns: DataTableColumns<Warehouse> = [
  ...warehousesListColumns.map(col => {
    if (col.key === 'actions') {
      return {
        ...col,
        render: (row: Warehouse) => {
          return h(NSpace, {}, {
            default: () => [
              h(NButton, {
                size: 'small',
                onClick: () => emit('edit', row.id)
              }, { default: () => 'Редактировать' })
            ]
          })
        }
      }
    }
    return col
  })
]
</script>

<style scoped>
.warehouses-list {
  width: 100%;
}
</style>
