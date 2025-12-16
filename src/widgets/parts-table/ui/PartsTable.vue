<template>
  <div class="parts-table">
    <n-space vertical>
      <n-space justify="space-between">
        <n-space>
          <n-button
            v-if="selectedIds.size > 0"
            type="error"
            @click="handleBulkDelete"
          >
            Удалить выбранные ({{ selectedIds.size }})
          </n-button>
        </n-space>
        <n-button type="primary" @click="emit('create')">
          Добавить запчасть
        </n-button>
      </n-space>

      <n-data-table
        :columns="columns"
        :data="partStore.parts"
        :loading="partStore.isLoading"
        :row-key="(row: PartListItem) => row.id"
        :pagination="paginationReactive"
        :bordered="false"
        @update:checked-row-keys="handleCheck"
      />
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { h, reactive, toRef } from 'vue'
import { NSpace, NButton, NDataTable, NTag } from 'naive-ui'
import { usePartStore } from '@entities/part'
import { useDeletePart } from '@features/part/delete-part'
import { partsTableColumns } from '../lib/columns'
import { useTableSelection } from '@shared/lib/hooks/use-table-selection'
import type { DataTableColumns } from 'naive-ui'
import type { PartListItem } from '@entities/part'

const emit = defineEmits<{
  create: []
  edit: [id: number]
}>()

const partStore = usePartStore()
const { deletePart, bulkDeleteParts } = useDeletePart()
const partsRef = toRef(partStore, 'parts')
const { selectedIds, toggleItem, clearSelection } = useTableSelection<PartListItem>(partsRef)

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

const columns: DataTableColumns<PartListItem> = [
  {
    type: 'selection'
  },
  ...partsTableColumns.map(col => {
    if (col.key === 'status') {
      return {
        ...col,
        render: (row: PartListItem) => {
          const statusMap: Record<string, { label: string; type: 'success' | 'warning' | 'error' }> = {
            available: { label: 'Доступно', type: 'success' },
            out_of_stock: { label: 'Нет в наличии', type: 'error' },
            reserved: { label: 'Зарезервировано', type: 'warning' }
          }
          const status = statusMap[row.status] || { label: row.status, type: 'default' }
          return h(NTag, { type: status.type }, { default: () => status.label })
        }
      }
    }
    if (col.key === 'actions') {
      return {
        ...col,
        render: (row: PartListItem) => {
          return h(NSpace, {}, {
            default: () => [
              h(NButton, {
                size: 'small',
                onClick: () => emit('edit', row.id)
              }, { default: () => 'Редактировать' }),
              h(NButton, {
                size: 'small',
                type: 'error',
                onClick: async () => {
                  const success = await deletePart(row.id, row.name)
                  if (success) {
                    await partStore.loadParts()
                  }
                }
              }, { default: () => 'Удалить' })
            ]
          })
        }
      }
    }
    if (col.key === 'warehouse.name' || col.key === 'category.name') {
      return {
        ...col,
        render: (row: PartListItem) => {
          const keys = col.key.split('.')
          let value: any = row
          for (const k of keys) {
            value = value?.[k]
          }
          return value || '-'
        }
      }
    }
    return col
  })
]

function handleCheck(keys: Array<string | number>) {
  clearSelection()
  keys.forEach(key => toggleItem(key as number))
}

async function handleBulkDelete() {
  const ids = Array.from(selectedIds.value) as number[]
  const success = await bulkDeleteParts(ids, ids.length)
  if (success) {
    clearSelection()
    await partStore.loadParts()
  }
}
</script>

<style scoped>
.parts-table {
  width: 100%;
}
</style>
