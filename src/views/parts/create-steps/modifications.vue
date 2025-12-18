<template>
  <div class="space-y-6">
    <!-- Заголовок -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-slate-900">Выберите модификацию</h3>
      <p class="text-sm text-slate-500 mt-1">Выберите конкретную модификацию автомобиля с характеристиками</p>
    </div>

    <!-- Сетка модификаций -->
    <n-spin :show="modificationStore.isLoading">
      <div v-if="modificationStore.modifications.length > 0" class="grid grid-cols-1 gap-4">
        <SelectCard
          v-for="(item, index) in modificationStore.modifications"
          :key="index"
          :title="item.modelCar.name"
          :subtitle="item.bodyType"
          :specs="getSpecs(item)"
          :logo="item.image"
          :id="item.id"
          :is-selected="item.id == modificationId"
          @confirm="onConfirm"
          @select="onSelect(item.id)"
        />
      </div>

      <!-- Пустое состояние -->
      <div v-else class="flex flex-col items-center justify-center py-12 text-center">
        <n-icon :component="ConstructOutline" :size="48" class="mb-3 text-slate-400" />
        <p class="text-sm font-semibold text-slate-700">Модификации не найдены</p>
        <p class="text-xs text-slate-500 mt-1">Для выбранной модели нет доступных модификаций</p>
      </div>
    </n-spin>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onMounted } from 'vue'
import { SelectCard } from '@/views/parts/ui'
import { NIcon, NSpin } from 'naive-ui'
import { ConstructOutline } from '@vicons/ionicons5'
import { useRoute, useRouter } from 'vue-router'
import { useModificationsStore } from '@/stores/modifications-store'
import { setCurrent } from '@/views/parts/create-steps/index.ts'

const modificationStore = useModificationsStore()
const router = useRouter()
const route = useRoute()
const emit = defineEmits(['confirm'])
const modificationId = ref()

function onSelect(value: number) {
  modificationId.value = value
  router.push({ query: { ...route.query, modificationId: modificationId.value } })
}

function onConfirm(id: number) {
  router.push({ query: { ...route.query } })
  setCurrent(3)
  emit('confirm', id)
}

function getSpecs(item: any): string[] {
  const specs = []

  if (item.capacity) {
    specs.push(`${item.capacity} л.с.`)
  }

  if (item.fuelType) {
    specs.push(item.fuelType)
  }

  if (item.gearType) {
    specs.push(item.gearType)
  }

  if (item.driveType) {
    specs.push(item.driveType)
  }

  return specs
}

onMounted(() => {
  if (route.query.modificationId != null) {
    modificationId.value = parseInt(route.query.modificationId.toString())
  }
  if (route.query.modelCarId != null) {
    modificationStore.loadModifications(parseInt(route.query.modelCarId.toString()))
  }
  if (route.query.productId != null) {
    setCurrent(4)
  }
})
</script>
