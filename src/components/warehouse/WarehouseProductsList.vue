<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold">Товары на складе</h2>
      <div class="text-sm text-gray-500">
        Заполнено {{ products.length }} из {{ warehouseCapacity }}
      </div>
    </div>
    <n-spin :show="isLoading">
      <div v-if="products.length === 0" class="text-gray-400 text-center py-8">
        Нет товаров на этом складе.
        <router-link
          :to="{ name: 'parts-create', query: { warehouse_id: warehouseId } }"
          class="ml-2 text-primary underline hover:text-primary-600 transition"
        >
          Создать новый товар
        </router-link>
      </div>
      <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="product in products"
          :key="product.id"
          class="flex flex-col p-4 bg-white rounded shadow relative hover:bg-gray-50 transition"
        >
          <router-link
            :to="{ name: 'parts-detail', params: { id: product.id } }"
            class="flex-1 flex flex-col"
          >
            <img
              :src="product.pictures?.[0]?.image"
              class="mx-auto"
            />
            <div class="flex-1 mt-4 text-center">
              <div class="font-medium text-nowrap">{{ product.name }}</div>
              <div class="text-sm text-gray-500 mb-1">{{ product.category?.name }}</div>
              <div class="text-primary font-semibold">{{ product.price }}₸</div>
              <div class="text-primary font-semibold">#{{ product.id }}</div>
            </div>
          </router-link>
          <div class="w-full pointer flex justify-center mt-4">
            <warehouse-component
              :view_mode="'to_move'"
              :warehouse="product.warehouse"
              @on-changed-prop="(body) => onChangeWarehouse(body, product.id)"
            />
          </div>
        </div>
      </div>
    </n-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { NSpin, useMessage } from 'naive-ui'
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

const onChangeWarehouse = async (body: any, productId: number) => {
  // Используем прямой запрос через axios, как в detail.vue
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
