<template>
  <main class="space-y-5">
    <!-- Breadcrumbs -->
    <n-breadcrumb class="mb-2">
      <n-breadcrumb-item>
        <router-link to="/" class="text-slate-600 hover:text-slate-900 transition-colors">
          Главная
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        <router-link :to="{ name: 'warehouses-list' }" class="text-slate-600 hover:text-slate-900 transition-colors">
          Склады
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        <span class="text-slate-900 font-medium">{{ warehouse?.name || 'Детали' }}</span>
      </n-breadcrumb-item>
    </n-breadcrumb>

    <!-- Header Card -->
    <div>
      <div class="rounded-3xl border border-slate-200/80 bg-white px-6 py-5 shadow-sm">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <!-- Левая часть: информация -->
          <div class="space-y-3">
            <div class="flex flex-wrap items-center gap-3">
              <!-- Иконка склада -->
              <div class="flex items-center justify-center w-16 h-16 rounded-lg bg-indigo-100 text-indigo-600">
                <n-icon :component="BusinessOutline" :size="32" />
              </div>

              <div>
                <p class="text-2xl font-semibold text-slate-900">
                  {{ warehouse?.name }}
                </p>
                <span class="text-xs font-semibold text-slate-500">ID {{ warehouse?.id }}</span>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <span v-if="warehouse?.city" class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
                📍 {{ warehouse.city.name }}
              </span>
              <span v-if="warehouse?.min_stock_level" class="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-indigo-700">
                📦 Мин. уровень: {{ warehouse.min_stock_level }}
              </span>
            </div>
          </div>

          <!-- Правая часть: кнопки действий -->
          <div class="flex flex-wrap items-center gap-2">
            <n-button quaternary round @click="router.back()">Назад</n-button>
            <n-button type="error" secondary round @click="handleDelete">
              Удалить
            </n-button>
            <n-button type="primary" round :loading="isLoadingPatch" @click="onSave">
              Сохранить
            </n-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="!warehouse" class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      <n-skeleton height="420px" width="100%" :sharp="false" />
      <n-skeleton height="420px" width="100%" :sharp="false" />
      <n-skeleton height="420px" width="100%" :sharp="false" />
    </div>

    <!-- Контент -->
    <div v-else class="space-y-4">
      <!-- Основная информация -->
      <n-card size="large">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-slate-900">Основная информация</h3>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Название</p>
            <n-input v-model:value="editForm.name" placeholder="Введите название склада" />
          </div>

          <div class="space-y-2">
            <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Город</p>
            <n-select
              v-model:value="editForm.city_id"
              :options="cityOptions"
              placeholder="Выберите город"
              filterable
              clearable
            />
          </div>

          <div class="space-y-2">
            <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Минимальный уровень запасов</p>
            <n-input-number
              v-model:value="editForm.min_stock_level"
              placeholder="Введите минимальный уровень"
              class="w-full"
              :min="0"
            />
          </div>

          <div class="space-y-2">
            <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Категории деталей</p>
            <n-select
              v-model:value="editForm.category_ids"
              :options="categoryStore.categoriesOptions"
              placeholder="Выберите категории"
              multiple
              filterable
            />
          </div>
        </div>
      </n-card>

      <!-- Дополнительная информация -->
      <n-card size="large">
        <h3 class="mb-3 text-lg font-semibold text-slate-900">Дополнительная информация</h3>
        <div class="grid gap-3 sm:grid-cols-2">
          <div class="rounded-2xl bg-slate-50 px-3 py-2">
            <p class="text-xs uppercase tracking-[0.08em] text-slate-500">Создан</p>
            <p class="text-sm font-semibold text-slate-900">{{ formatDate(warehouse?.created_at) }}</p>
          </div>

          <div class="rounded-2xl bg-slate-50 px-3 py-2">
            <p class="text-xs uppercase tracking-[0.08em] text-slate-500">Последнее обновление</p>
            <p class="text-sm font-semibold text-slate-900">{{ formatDate(warehouse?.updated_at) }}</p>
          </div>
        </div>
      </n-card>

      <!-- Товары на складе -->
      <section>
        <warehouse-products-list :warehouse-id="warehouse.id" />
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NCard,
  NInput,
  NInputNumber,
  NSelect,
  NButton,
  NBreadcrumb,
  NBreadcrumbItem,
  NSkeleton,
  NIcon,
  useMessage,
  useDialog
} from 'naive-ui'
import { BusinessOutline } from '@vicons/ionicons5'
import { useWarehouseStore } from '@entities/warehouse'
import { useCategoryStore } from '@entities/category'
import axiosIns from '@/shared/api/axios'
import { formatDate } from '@/shared/lib/formatDate'
import WarehouseProductsList from '@/components/warehouse/WarehouseProductsList.vue'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const dialog = useDialog()
const warehouseStore = useWarehouseStore()
const categoryStore = useCategoryStore()

const isLoadingPatch = ref(false)

const warehouse = ref<any>(null)
const editForm = ref<any>({})

const cityOptions = ref<{ label: string, value: any }[]>([])

async function loadWarehouse() {
  const { id } = route.params
  warehouse.value = await warehouseStore.loadWarehouse(parseInt(id.toString()))
  editForm.value = {
    name: warehouse.value.name,
    city_id: warehouse.value.city?.id,
    min_stock_level: warehouse.value.min_stock_level,
    category_ids: warehouse.value.categories?.map((c: any) => c.id) || []
  }
}

async function fetchCities() {
  const res = await axiosIns.get('/api/admin/handbook/city/')
  cityOptions.value = res.data.results.map((c: any) => ({
    label: c.name,
    value: c.id
  }))
}

async function onSave() {
  isLoadingPatch.value = true
  try {
    await axiosIns.patch(`/api/admin/stock/warehouses/${warehouse.value.id}/`, editForm.value)
    message.success('Склад обновлен')
    await loadWarehouse()
  } catch (e) {
    message.error('Ошибка при сохранении')
  } finally {
    isLoadingPatch.value = false
  }
}

function handleDelete() {
  dialog.warning({
    title: 'Удалить склад?',
    content: `Вы уверены, что хотите удалить склад "${warehouse.value?.name}"? Это действие необратимо.`,
    positiveText: 'Удалить',
    negativeText: 'Отмена',
    onPositiveClick: async () => {
      try {
        await warehouseStore.removeWarehouse(route.params.id.toString())
        message.success('Склад удален')
        router.push({ name: 'warehouses-list' })
      } catch (e) {
        message.error('Ошибка при удалении')
      }
    }
  })
}

onMounted(() => {
  loadWarehouse()
  fetchCities()
  categoryStore.loadCategories()
})
</script>
