<template>
  <div class="space-y-6">
    <!-- Состояние: Выбор производителя -->
    <div v-if="!manufacturerId">
      <!-- Заголовок -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-slate-900">Выберите производителя</h3>
        <p class="text-sm text-slate-500 mt-1">Найдите и выберите производителя автомобиля</p>
      </div>

      <!-- Поиск -->
      <n-input
        @input="searchManufacturer"
        placeholder="Поиск производителя..."
        clearable
        size="large"
        class="mb-6"
      >
        <template #prefix>
          <n-icon :component="SearchOutline" />
        </template>
      </n-input>

      <!-- Сетка производителей -->
      <n-spin :show="manufacturerStore.isLoading">
        <!-- Популярные производители -->
        <div v-if="popularManufacturers.length > 0 && !isSearching" class="mb-8">
          <div class="mb-4 flex items-center gap-2">
            <n-icon :component="StarOutline" :size="20" class="text-primary-600" />
            <h4 class="font-semibold text-slate-900">Популярные бренды</h4>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SelectCard
              v-for="(item, index) in popularManufacturers"
              :key="`popular-${index}`"
              :title="item.name"
              :logo="item.image"
              :id="item.id"
              :is-selected="item.id == manufacturerId"
              @select="onSelect(item.id)"
            />
          </div>
        </div>

        <!-- Все производители -->
        <div v-if="otherManufacturers.length > 0">
          <div v-if="!isSearching" class="mb-4 flex items-center gap-2">
            <h4 class="font-semibold text-slate-900">Все производители</h4>
            <span class="text-sm text-slate-500">({{ otherManufacturers.length }})</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SelectCard
              v-for="(item, index) in otherManufacturers"
              :key="`other-${index}`"
              :title="item.name"
              :logo="item.image"
              :id="item.id"
              :is-selected="item.id == manufacturerId"
              @select="onSelect(item.id)"
            />
          </div>
        </div>

        <!-- Пустое состояние -->
        <div v-if="manufacturerStore.searchManufacturers.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
          <n-icon :component="CarSportOutline" :size="48" class="mb-3 text-slate-400" />
          <p class="text-sm font-semibold text-slate-700">Производители не найдены</p>
          <p class="text-xs text-slate-500 mt-1">Попробуйте изменить поисковый запрос</p>
        </div>
      </n-spin>
    </div>

    <!-- Состояние: Выбор модели автомобиля -->
    <div v-else-if="manufacturerId">
      <!-- Заголовок с кнопкой назад -->
      <div class="mb-6 flex items-center justify-between gap-4">
        <div>
          <h3 class="text-lg font-semibold text-slate-900">Выберите модель</h3>
          <p class="text-sm text-slate-500 mt-1">Выберите конкретную модель автомобиля</p>
        </div>
        <n-button
          quaternary
          round
          @click="clearManufacturers"
        >
          <template #icon>
            <n-icon :component="ArrowBackOutline" />
          </template>
          Назад к производителям
        </n-button>
      </div>

      <!-- Поиск -->
      <n-input
        @input="searchModelCar"
        placeholder="Поиск модели..."
        clearable
        size="large"
        class="mb-6"
      >
        <template #prefix>
          <n-icon :component="SearchOutline" />
        </template>
      </n-input>

      <!-- Сетка моделей -->
      <n-spin :show="manufacturerStore.isLoading">
        <div v-if="manufacturerStore.searchModelCars.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SelectCard
            v-for="(item, index) in manufacturerStore.searchModelCars"
            :key="index"
            :title="item.name"
            :logo="item.image"
            :id="item.id"
            :is-selected="item.id == modelCarId"
            @select="onSelectModelCar(item.id)"
            @confirm="confirmModelCar"
          />
        </div>

        <!-- Пустое состояние -->
        <div v-else class="flex flex-col items-center justify-center py-12 text-center">
          <n-icon :component="CarSportOutline" :size="48" class="mb-3 text-slate-400" />
          <p class="text-sm font-semibold text-slate-700">Модели не найдены</p>
          <p class="text-xs text-slate-500 mt-1">Попробуйте изменить поисковый запрос или выберите другого производителя</p>
        </div>
      </n-spin>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useManufacturerStore } from '@/stores/manufacturer-store'
import { onMounted } from 'vue'
import { SelectCard } from '@/views/parts/ui'
import { NInput, NIcon, NSpin, NButton } from 'naive-ui'
import { SearchOutline, CarSportOutline, ArrowBackOutline, StarOutline } from '@vicons/ionicons5'
import { useRoute, useRouter } from 'vue-router'
import { setCurrent } from '@/views/parts/create-steps/index.ts'

const manufacturerStore = useManufacturerStore()
const emit = defineEmits(['confirm'])
const router = useRouter()
const route = useRoute()

const manufacturerId = ref<number>()
const modelCarId = ref<number>()
const isSearching = ref(false)

// Список популярных брендов
const POPULAR_BRANDS = [
  'AUDI',
  'BMW',
  'DAEWOO',
  'KIA',
  'LADA',
  'MERCEDES-BENZ',
  'MERCEDES BENZ',
  'TOYOTA',
  'VOLVO',
  'MAZDA',
  'FORD'
]

const popularManufacturers = computed(() => {
  return manufacturerStore.searchManufacturers.filter(m =>
    POPULAR_BRANDS.some(brand => m.name.toUpperCase().includes(brand))
  )
})

const otherManufacturers = computed(() => {
  const popularIds = new Set(popularManufacturers.value.map(m => m.id))
  return manufacturerStore.searchManufacturers.filter(m => !popularIds.has(m.id))
})

function onSelect(id: number) {
  manufacturerId.value = id
  manufacturerStore.loadModelCars(manufacturerId.value).then(res => {
    manufacturerStore.searchModelCars = res
  })
  router.push({ query: { ...route.query, manufacturerId: id } })
}

function onSelectModelCar(id: number) {
  modelCarId.value = id
  router.push({ query: { ...route.query, modelCarId: id } })
  setCurrent(1)
}

function clearManufacturers() {
  manufacturerId.value = undefined
  modelCarId.value = undefined
  router.push({ query: {} })
}

function searchManufacturer(value: string) {
  isSearching.value = value !== '' && value !== undefined

  if (value == '' || value == undefined) {
    manufacturerStore.searchManufacturers = manufacturerStore.manufacturers
    return
  }
  const searched = manufacturerStore.manufacturers.filter((item) =>
    item.name.toLowerCase().includes(value.toLowerCase())
  )
  manufacturerStore.searchManufacturers = searched
}

function searchModelCar(value: string) {
  if (value == '' || value == undefined) {
    manufacturerStore.searchModelCars = manufacturerStore.modelCars
    return
  }
  const searched = manufacturerStore.modelCars.filter((item) =>
    item.name.toLowerCase().includes(value.toLowerCase())
  )
  manufacturerStore.searchModelCars = searched
}

function confirmModelCar() {
  router.push({ query: { ...route.query } })
  setCurrent(2)
  emit('confirm')
}

onMounted(() => {
  if (route.query.manufacturerId != null) {
    manufacturerId.value = parseInt(route.query.manufacturerId.toString())
    manufacturerStore.loadModelCars(manufacturerId.value).then(res => {
      manufacturerStore.searchModelCars = res
    })
  }
  if (route.query.modelCarId != null) {
    modelCarId.value = parseInt(route.query.modelCarId.toString())
  }

  if (route.query.productId != null) {
    setCurrent(4)
  }

  manufacturerStore.loadManufacturers().then(manufacturers => {
    manufacturerStore.searchManufacturers = manufacturers
  })
})
</script>
