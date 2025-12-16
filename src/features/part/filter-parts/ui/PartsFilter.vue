<template>
  <n-card title="Фильтры">
    <n-space vertical>
      <n-form-item label="Название">
        <n-input
          :value="filterStore.filters.search"
          placeholder="Поиск по названию"
          clearable
          @update:value="(val: any) => filterStore.setFilter('search', val)"
        />
      </n-form-item>

      <n-form-item label="Категория">
        <n-tree-select
          :value="filterStore.filters.category"
          :options="categoryOptions"
          placeholder="Выберите категорию"
          clearable
          @update:value="(val: any) => filterStore.setFilter('category', val)"
        />
      </n-form-item>

      <n-form-item label="Склад">
        <n-select
          :value="filterStore.filters.warehouseId"
          :options="warehouseOptions"
          placeholder="Выберите склад"
          clearable
          @update:value="(val: any) => filterStore.setFilter('warehouseId', val)"
        />
      </n-form-item>

      <n-form-item label="Статус">
        <n-select
          :value="filterStore.filters.status"
          :options="statusOptions"
          placeholder="Выберите статус"
          clearable
          @update:value="(val: any) => filterStore.setFilter('status', val)"
        />
      </n-form-item>

      <n-space>
        <n-button type="primary" @click="handleApply">
          Применить
        </n-button>
        <n-button @click="handleClear">
          Сбросить
        </n-button>
      </n-space>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { NCard, NSpace, NFormItem, NInput, NTreeSelect, NSelect, NButton } from 'naive-ui'
import { usePartFilterStore } from '../model/filter-store'
import { usePartStore } from '@entities/part'
import { useCategoryStore, buildCategoryTree } from '@entities/category'
import { useWarehouseStore } from '@entities/warehouse'

const filterStore = usePartFilterStore()
const partStore = usePartStore()
const categoryStore = useCategoryStore()
const warehouseStore = useWarehouseStore()

const categoryOptions = computed(() => {
  return buildCategoryTree(categoryStore.categoriesTree)
})

const warehouseOptions = computed(() => {
  return warehouseStore.warehouses.map(w => ({
    label: w.name,
    value: w.id
  }))
})

const statusOptions = [
  { label: 'Доступно', value: 'available' },
  { label: 'Нет в наличии', value: 'out_of_stock' },
  { label: 'Зарезервировано', value: 'reserved' }
]

onMounted(async () => {
  await Promise.all([
    categoryStore.loadCategoriesTree(),
    warehouseStore.loadWarehouses()
  ])
})

function handleApply() {
  partStore.loadParts(filterStore.filters)
}

function handleClear() {
  filterStore.clearFilters()
  partStore.loadParts()
}
</script>
