<template>
  <div class="clients-list">
    <n-space vertical>
      <n-space justify="space-between">
        <n-text strong>Клиенты</n-text>
        <n-button type="primary" @click="emit('create')">
          Добавить клиента
        </n-button>
      </n-space>

      <n-data-table
        :columns="columns"
        :data="clientStore.clients"
        :loading="clientStore.isLoading"
        :row-key="(row: Client) => row.id"
        :pagination="paginationReactive"
        :bordered="false"
      />
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { h, reactive } from 'vue'
import { NSpace, NText, NButton, NDataTable } from 'naive-ui'
import { useClientStore } from '@entities/client'
import { clientsListColumns } from '../lib/columns'
import type { DataTableColumns } from 'naive-ui'
import type { Client } from '@entities/client'

const emit = defineEmits<{
  create: []
  edit: [id: number]
}>()

const clientStore = useClientStore()

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

const columns: DataTableColumns<Client> = [
  ...clientsListColumns.map(col => {
    if (col.key === 'actions') {
      return {
        ...col,
        render: (row: Client) => {
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
.clients-list {
  width: 100%;
}
</style>
