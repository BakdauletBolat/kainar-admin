<template>
  <div class="space-y-6">
    <!-- Заголовок -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-slate-900">Назначение склада</h3>
      <p class="text-sm text-slate-500 mt-1">Выберите склад для размещения запчасти</p>
    </div>

    <!-- Информация о запчасти -->
    <div v-if="productStore.product" class="rounded-2xl bg-slate-50 p-4 border border-slate-200">
      <div class="flex items-center gap-3">
        <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-primary-100 text-primary-600">
          <n-icon :component="CogOutline" :size="24" />
        </div>
        <div class="flex-1">
          <p class="font-semibold text-slate-900">{{ productStore.product.name }}</p>
          <p class="text-sm text-slate-500">ID: #{{ productStore.product.id }}</p>
        </div>
        <div v-if="productStore.product.price" class="text-right">
          <p class="text-xs text-slate-500">Цена</p>
          <p class="font-bold text-slate-900">{{ formatPrice(productStore.product.price) }}</p>
        </div>
      </div>
    </div>

    <!-- Выбор склада -->
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">Выберите склад</label>
        <n-select
          :loading="warehouseStore.isLoading"
          clearable
          filterable
          remote
          @search="handleSearchWarehouse"
          v-model:value="warehouseId"
          :options="warehouseStore.warehousesOptions"
          placeholder="Начните вводить название склада..."
          size="large"
        >
          <template #empty>
            <div class="py-4 text-center text-slate-500">
              <n-icon :component="BusinessOutline" :size="32" class="mb-2" />
              <p class="text-sm">Склады не найдены</p>
            </div>
          </template>
        </n-select>
      </div>

      <!-- Информация -->
      <div class="rounded-lg bg-blue-50 border border-blue-200 p-4">
        <div class="flex gap-3">
          <n-icon :component="InformationCircleOutline" :size="20" class="text-blue-600 mt-0.5" />
          <div class="text-sm text-blue-900">
            <p class="font-semibold mb-1">Важно знать:</p>
            <ul class="list-disc list-inside space-y-1 text-blue-800">
              <li>После назначения запчасть будет доступна для продажи</li>
              <li>Вы сможете изменить склад позже в карточке запчасти</li>
              <li>Убедитесь, что выбран правильный склад для размещения</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Кнопки -->
    <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
      <n-button
        :disabled="!warehouseId || isLoading"
        :loading="isLoading"
        type="primary"
        round
        size="large"
        @click="assignWarehouse"
      >
        <template #icon>
          <n-icon :component="CheckmarkCircleOutline" />
        </template>
        Завершить создание
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePartStore as useProductStore } from '@entities/part'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NSelect, NButton, NIcon, useMessage } from 'naive-ui'
import {
  CogOutline,
  BusinessOutline,
  InformationCircleOutline,
  CheckmarkCircleOutline
} from '@vicons/ionicons5'
import { useWarehouseStore } from '@entities/warehouse'
import axiosIns from '@/shared/api/axios'

const productStore = useProductStore()
const warehouseStore = useWarehouseStore()
const route = useRoute()
const router = useRouter()
const message = useMessage()

const warehouseId = ref<number>()
const isLoading = ref(false)

function handleSearchWarehouse(value: string) {
  warehouseStore.loadWarehouses({
    search: value
  })
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'KZT',
    minimumFractionDigits: 0
  }).format(price)
}

function assignWarehouse() {
  if (!warehouseId.value) {
    message.warning('Выберите склад')
    return
  }

  isLoading.value = true
  axiosIns
    .post('/api/admin/product/v2/product/assign-warehouse/', {
      warehouse_id: warehouseId.value,
      product_id: route.query.productId
    })
    .then((_) => {
      message.success('Запчасть успешно создана и назначена на склад!')
      router.push({
        name: 'parts-detail',
        params: {
          id: route.query.productId?.toString()
        }
      })
    })
    .catch((e) => {
      console.error(e)
      message.error('Ошибка при назначении склада')
    })
    .finally(() => {
      isLoading.value = false
    })
}

onMounted(() => {
  if (route.query.productId != null) {
    productStore.loadProduct(route.query.productId.toString())
  }
  warehouseStore.loadWarehouses({
    page_size: 10,
    page: 1
  })
})
</script>
