<template>
  <n-card
    class="cursor-pointer relative bg-white hover:bg-slate-50 p-4 border-2 border-slate-200 shadow-sm rounded-2xl transition-all duration-200"
    :class="{
      '!border-primary-500 !bg-primary-50/30 shadow-md': isSelected
    }"
    @click="toggleSelection"
  >
    <div class="flex items-start gap-4">
      <!-- Логотип -->
      <div v-if="logo" class="flex-shrink-0">
        <img :src="logo" alt="logo" class="w-16 h-16 object-cover rounded-lg border border-slate-200" />
      </div>
      <div v-else class="flex-shrink-0 w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
        <n-icon :component="ImageOutline" :size="32" class="text-slate-400" />
      </div>

      <!-- Информация -->
      <div class="flex-1 min-w-0">
        <h4 class="text-base font-semibold text-slate-900 mb-1 line-clamp-2">
          {{ title }}
        </h4>

        <!-- Дополнительная информация (для модификаций) -->
        <div v-if="subtitle" class="space-y-1">
          <p v-if="subtitle" class="text-sm text-slate-600">{{ subtitle }}</p>
          <div v-if="specs && specs.length" class="flex flex-wrap gap-2 mt-2">
            <span
              v-for="(spec, index) in specs"
              :key="index"
              class="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
            >
              {{ spec }}
            </span>
          </div>
        </div>
      </div>

      <!-- Иконка выбора -->
      <div v-if="isSelected" class="flex-shrink-0">
        <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
          <n-icon :component="CheckmarkOutline" :size="20" class="text-white" />
        </div>
      </div>
    </div>

    <!-- Кнопка продолжить -->
    <div v-if="isSelected" class="mt-4 pt-4 border-t border-slate-200">
      <n-button
        @click.stop="emit('confirm')"
        type="primary"
        round
        block
        size="large"
      >
        Продолжить
      </n-button>
    </div>
  </n-card>
</template>

<script lang="ts" setup>
import { NButton, NCard, NIcon } from 'naive-ui'
import { ImageOutline, CheckmarkOutline } from '@vicons/ionicons5'

interface CardProps {
  title: string
  id: number
  isSelected: boolean
  logo?: string | null
  subtitle?: string
  specs?: string[]
}

const props = defineProps<CardProps>()

const emit = defineEmits(['select', 'confirm'])

function toggleSelection() {
  emit('select', props.id)
}
</script>
