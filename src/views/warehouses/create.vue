<template>
  <main class="space-y-5 max-w-4xl mx-auto">
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
        <span class="text-slate-900 font-medium">Создание склада</span>
      </n-breadcrumb-item>
    </n-breadcrumb>

    <!-- Header Card -->
    <div class="rounded-3xl border border-slate-200/80 bg-white px-6 py-5 shadow-sm">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <!-- Левая часть: информация -->
        <div class="flex items-center gap-4">
          <div class="flex items-center justify-center w-16 h-16 rounded-lg bg-indigo-100 text-indigo-600">
            <n-icon :component="BusinessOutline" :size="32" />
          </div>
          <div>
            <div class="text-2xl font-semibold text-slate-900">Новый склад</div>
            <div class="text-sm text-slate-600">Заполните информацию о складе</div>
          </div>
        </div>

        <!-- Правая часть: кнопка назад -->
        <n-button quaternary round @click="router.back()">
          Назад
        </n-button>
      </div>
    </div>

    <!-- Форма создания -->
    <n-card size="large">
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-slate-900">Основная информация</h3>
        <p class="text-sm text-slate-500 mt-1">Укажите название, город и параметры склада</p>
      </div>

      <n-form
        ref="formRef"
        :model="formValue"
        :rules="rules"
        label-placement="top"
        require-mark-placement="left"
      >
        <div class="grid gap-4 sm:grid-cols-2">
          <n-form-item label="Название склада" path="name">
            <n-input
              v-model:value="formValue.name"
              placeholder="Введите название склада"
              size="large"
            />
          </n-form-item>

          <n-form-item label="Город" path="city_id">
            <n-select
              v-model:value="formValue.city_id"
              :options="cityOptions"
              placeholder="Выберите город"
              filterable
              size="large"
            />
          </n-form-item>

          <n-form-item label="Минимальный уровень запасов" path="min_stock_level">
            <n-input-number
              v-model:value="formValue.min_stock_level"
              placeholder="Введите минимальный уровень"
              class="w-full"
              size="large"
              :min="0"
            />
          </n-form-item>

          <n-form-item label="Категории деталей" path="category_ids" class="sm:col-span-2">
            <n-select
              v-model:value="formValue.category_ids"
              :options="categoryStore.categoriesOptions"
              placeholder="Выберите категории"
              multiple
              filterable
              size="large"
            />
          </n-form-item>
        </div>

        <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <n-button
            quaternary
            round
            size="large"
            @click="router.back()"
          >
            Отмена
          </n-button>
          <n-button
            type="primary"
            round
            size="large"
            :loading="isLoading"
            :disabled="isLoading"
            @click="handleValidateClick"
          >
            Создать склад
          </n-button>
        </div>
      </n-form>
    </n-card>
  </main>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  type FormInst,
  NButton,
  NCard,
  NInput,
  NForm,
  NFormItem,
  NSelect,
  NInputNumber,
  NBreadcrumb,
  NBreadcrumbItem,
  NIcon,
  useMessage
} from 'naive-ui'
import { BusinessOutline } from '@vicons/ionicons5'
import { useCategoryStore } from '@/stores/category-storage.ts'
import axiosIns from '@/shared/api/axios'

const formRef = ref<FormInst | null>(null)
const isLoading = ref(false)
const router = useRouter()
const message = useMessage()
const categoryStore = useCategoryStore()

const cityOptions = ref<{ label: string, value: any }[]>([])

const formValue = reactive({
  name: '',
  city_id: null as number | null,
  min_stock_level: 20,
  category_ids: [] as number[]
})

const rules = {
  name: {
    required: true,
    message: 'Название обязательно',
    trigger: 'blur'
  },
  city_id: {
    type: 'number',
    required: true,
    message: 'Выберите город',
    trigger: ['blur', 'change']
  },
  min_stock_level: {
    type: 'number',
    required: false,
    message: 'Укажите минимальный уровень',
    trigger: 'blur'
  },
  category_ids: {
    type: 'array',
    required: false,
    message: 'Выберите категории',
    trigger: 'change'
  }
}

async function fetchCities() {
  const res = await axiosIns.get('/api/admin/handbook/city/')
  cityOptions.value = res.data.results.map((c: any) => ({
    label: c.name,
    value: c.id
  }))
}

onMounted(() => {
  categoryStore.loadCategories()
  fetchCities()
})

const create = async (values: any) => {
  isLoading.value = true
  try {
    await axiosIns.post('/api/stock/warehouses/', values)
    message.success('Склад успешно создан')
    router.push({ name: 'warehouses-list' })
  } catch (e: any) {
    console.error('Ошибка при создании склада:', e)
    if (e.response?.data) {
      const errorData = e.response.data
      // Показываем первую ошибку из ответа
      const firstError = Object.values(errorData)[0]
      if (Array.isArray(firstError) && firstError.length > 0) {
        message.error(firstError[0])
      } else {
        message.error('Ошибка при создании склада')
      }
    } else {
      message.error('Ошибка при создании склада')
    }
  } finally {
    isLoading.value = false
  }
}

function handleValidateClick(e: Event) {
  e.preventDefault()
  formRef.value?.validate((errors) => {
    if (!errors) {
      create(formValue)
    } else {
      message.error('Заполните все обязательные поля')
    }
  })
}
</script>
