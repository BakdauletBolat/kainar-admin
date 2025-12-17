<template>
  <n-card size="large">
    <!-- Заголовок секции -->
    <div class="mb-4 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h3 class="text-lg font-semibold text-slate-900">Товары на складе</h3>
        <p class="text-sm text-slate-500 mt-1">
          Заполнено {{ products.length }} из {{ warehouseCapacity }}
        </p>
      </div>
      <router-link
        :to="{ name: 'parts-create', query: { warehouse_id: warehouseId } }"
      >
        <n-button type="primary" round size="medium">
          Добавить товар
        </n-button>
      </router-link>
    </div>

    <!-- Состояние загрузки -->
    <n-spin :show="isLoading">
      <!-- Пустое состояние -->
      <div v-if="products.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
        <n-icon :component="CubeOutline" :size="48" class="mb-3 text-slate-400" />
        <p class="text-sm font-semibold text-slate-700">Нет товаров на складе</p>
        <p class="text-xs text-slate-500 mt-1">Добавьте первый товар на этот склад</p>
        <router-link
          :to="{ name: 'parts-create', query: { warehouse_id: warehouseId } }"
          class="mt-4"
        >
          <n-button type="primary" round size="small">
            Создать товар
          </n-button>
        </router-link>
      </div>

      <!-- Сетка товаров -->
      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div
          v-for="product in products"
          :key="product.id"
          class="group rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
        >
          <router-link
            :to="{ name: 'parts-detail', params: { id: product.id } }"
            class="block"
          >
            <!-- Изображение товара -->
            <div class="relative aspect-square bg-slate-50 overflow-hidden">
              <img
                v-if="product.pictures?.[0]?.image"
                :src="product.pictures[0].image"
                :alt="product.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <n-icon :component="ImageOutline" :size="48" class="text-slate-300" />
              </div>

              <!-- ID badge -->
              <div class="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-semibold">
                #{{ product.id }}
              </div>
            </div>

            <!-- Информация о товаре -->
            <div class="p-4 space-y-2">
              <h4 class="font-semibold text-slate-900 line-clamp-2 leading-tight group-hover:text-primary-600 transition-colors">
                {{ product.name }}
              </h4>

              <div v-if="product.category" class="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                {{ product.category.name }}
              </div>

              <div class="text-lg font-bold text-slate-900">
                {{ formatPrice(product.price) }}
              </div>

              <div v-if="product.quantity !== undefined" class="text-sm text-slate-600">
                В наличии: <span class="font-semibold">{{ product.quantity }} шт</span>
              </div>
            </div>
          </router-link>

          <!-- Действие: перемещение товара -->
          <div class="px-4 pb-4 border-t border-slate-100 pt-3">
            <warehouse-component
              :view_mode="'to_move'"
              :warehouse="product.warehouse"
              @on-changed-prop="(body) => onChangeWarehouse(body, product.id)"
            />
          </div>
        </div>
      </div>
    </n-spin>
  </n-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { NCard, NSpin, NButton, NIcon, useMessage } from 'naive-ui'
import { CubeOutline, ImageOutline } from '@vicons/ionicons5'
import { useProductStore } from '@/stores/product-store'
import { useWarehouseStore } from '@/stores/warehouses-store'
import WarehouseComponent from '@/views/parts/ui/warehouse-component.vue'
import axiosIns from '@/apis'

const props = defineProps<{ warehouseId: number | string }>()

const productStore = useProductStore()
const warehouseStore = useWarehouseStore()
const products = ref<any[]>([])
const isLoading = ref(false)
const warehouseCapacity = ref<number>(0)
const message = useMessage()

const fetchProducts = async () => {
  if (!props.warehouseId) {
    products.value = []
    return
  }
  isLoading.value = true
  await productStore.loadProducts({ warehouse: props.warehouseId, page_size: 100 })
  products.value = productStore.products
  await warehouseStore.loadWarehouse(Number(props.warehouseId))
  warehouseCapacity.value = warehouseStore.warehouse?.min_stock_level || 0
  isLoading.value = false
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'KZT',
    minimumFractionDigits: 0
  }).format(price)
}

const onChangeWarehouse = async (body: any, productId: number) => {
  try {
    await axiosIns.post('/api/stock/move/', {
      ...body,
      product_id: productId
    })
    message.success('Товар успешно перемещён')
    fetchProducts()
  } catch (e: any) {
    console.error('Ошибка при перемещении товара:', e)
    if (e.response?.data?.message) {
      message.error(e.response.data.message)
    } else {
      message.error('Ошибка при перемещении')
    }
  }
}

onMounted(fetchProducts)
watch(() => props.warehouseId, fetchProducts)
</script>
