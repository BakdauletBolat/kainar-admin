<template>
  <div class="space-y-8">
    <!-- Заголовок -->
    <div>
      <h3 class="text-lg font-semibold text-slate-900">Информация о запчасти</h3>
      <p class="text-sm text-slate-500 mt-1">Заполните детальную информацию о запчасти</p>
    </div>

    <n-form :model="form" ref="formRef" label-placement="top" require-mark-placement="left">
      <!-- Секция: Основная информация -->
      <div class="space-y-4">
        <div class="flex items-center gap-2 pb-2 border-b border-slate-200">
          <n-icon :component="InformationCircleOutline" :size="20" class="text-primary-600" />
          <h4 class="font-semibold text-slate-900">Основная информация</h4>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <n-form-item label="Категория" required>
            <n-select
              filterable
              v-model:value="form.category"
              :options="categoryStore.categoriesOptions"
              placeholder="Выберите категорию"
              size="large"
            />
          </n-form-item>

          <n-form-item label="Название запчасти">
            <n-input v-model:value="form.name" placeholder="Автоматически из категории" size="large" disabled />
          </n-form-item>

          <n-form-item label="Цена (₸)">
            <n-input-number
              v-model:value="form.price"
              placeholder="Введите цену"
              class="w-full"
              size="large"
              :min="0"
            />
          </n-form-item>

          <n-form-item label="Цвет">
            <n-select
              :options="colorStore.colorOptions"
              v-model:value="form.color"
              placeholder="Выберите цвет"
              size="large"
            />
          </n-form-item>

          <n-form-item label="Коды запчасти" class="sm:col-span-2">
            <n-dynamic-input v-model:value="form.code" placeholder="Добавьте код" size="large" />
          </n-form-item>
        </div>
      </div>

      <!-- Секция: Технические характеристики -->
      <div class="space-y-4">
        <div class="flex items-center gap-2 pb-2 border-b border-slate-200">
          <n-icon :component="SettingsOutline" :size="20" class="text-primary-600" />
          <h4 class="font-semibold text-slate-900">Технические характеристики</h4>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <n-form-item label="Объем двигателя (л)">
            <n-input-number
              v-model:value="form.eav_attributes.engineDisplacement"
              placeholder="Напр. 2.0"
              class="w-full"
              size="large"
              :min="0"
              :step="0.1"
            />
          </n-form-item>

          <n-form-item label="Мощность (л.с.)">
            <n-input-number
              v-model:value="form.eav_attributes.power"
              placeholder="Напр. 150"
              class="w-full"
              size="large"
              :min="0"
            />
          </n-form-item>

          <n-form-item label="Емкость">
            <n-input-number
              v-model:value="form.eav_attributes.capacity"
              placeholder="Введите емкость"
              class="w-full"
              size="large"
              :min="0"
            />
          </n-form-item>

          <n-form-item label="Пробег (км)">
            <n-input-number
              v-model:value="form.mileage"
              placeholder="Напр. 50000"
              class="w-full"
              size="large"
              :min="0"
            />
          </n-form-item>

          <n-form-item label="Количество циклов">
            <n-input-number
              v-model:value="form.eav_attributes.numberOfCycle"
              placeholder="Напр. 4"
              class="w-full"
              size="large"
              :min="0"
            />
          </n-form-item>

          <n-form-item label="Количество клапанов">
            <n-input-number
              v-model:value="form.eav_attributes.numberOfValves"
              placeholder="Напр. 16"
              class="w-full"
              size="large"
              :min="0"
            />
          </n-form-item>

          <n-form-item label="VIN код" class="sm:col-span-2 lg:col-span-3">
            <n-input
              v-model:value="form.eav_attributes.vinCode"
              placeholder="Введите VIN код"
              size="large"
            />
          </n-form-item>
        </div>
      </div>

      <!-- Секция: Конфигурация -->
      <div class="space-y-4">
        <div class="flex items-center gap-2 pb-2 border-b border-slate-200">
          <n-icon :component="ConstructOutline" :size="20" class="text-primary-600" />
          <h4 class="font-semibold text-slate-900">Конфигурация</h4>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <n-form-item label="Тип кузова">
            <n-select
              v-model:value="form.eav_attributes.bodyType"
              :options="bodyTypeOptions"
              placeholder="Выберите тип"
              size="large"
            />
          </n-form-item>

          <n-form-item label="Конфигурация оси">
            <n-select
              v-model:value="form.eav_attributes.axleConfiguration"
              :options="axleConfigurationOptions"
              placeholder="Выберите конфигурацию"
              size="large"
            />
          </n-form-item>

          <n-form-item label="Привод">
            <n-select
              v-model:value="form.eav_attributes.driveType"
              :options="driveTypeOptions"
              placeholder="Выберите тип"
              size="large"
            />
          </n-form-item>

          <n-form-item label="Топливо">
            <n-select
              v-model:value="form.eav_attributes.fuelType"
              :options="fuelTypeOptions"
              placeholder="Выберите тип"
              size="large"
            />
          </n-form-item>

          <n-form-item label="Коробка передач">
            <n-select
              v-model:value="form.eav_attributes.gearType"
              :options="gearTypeOptions"
              placeholder="Выберите тип"
              size="large"
            />
          </n-form-item>

          <n-form-item label="Рулевое управление">
            <n-select
              v-model:value="form.eav_attributes.steeringType"
              :options="steeringTypeOptions"
              placeholder="Выберите тип"
              size="large"
            />
          </n-form-item>
        </div>
      </div>

      <!-- Секция: Дополнительная информация -->
      <div class="space-y-4">
        <div class="flex items-center gap-2 pb-2 border-b border-slate-200">
          <n-icon :component="DocumentTextOutline" :size="20" class="text-primary-600" />
          <h4 class="font-semibold text-slate-900">Дополнительная информация</h4>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <n-form-item label="Дефект">
            <n-input
              v-model:value="form.defect"
              type="textarea"
              placeholder="Опишите дефекты или повреждения (если есть)"
              :rows="3"
            />
          </n-form-item>

          <n-form-item label="Комментарий">
            <n-input
              v-model:value="form.comment"
              type="textarea"
              placeholder="Дополнительные комментарии или примечания"
              :rows="3"
            />
          </n-form-item>
        </div>
      </div>

      <!-- Кнопки -->
      <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <n-button :loading="isLoading" type="primary" round size="large" @click="handleSubmit">
          Сохранить и продолжить
        </n-button>
      </div>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
import axiosIns from '@/shared/api/axios'
import { useCategoryStore } from '@/stores/category-storage'
import {
  useMessage,
  NForm,
  NFormItem,
  NButton,
  NSelect,
  NInput,
  NInputNumber,
  NDynamicInput,
  NIcon
} from 'naive-ui'
import { onMounted, ref, watch } from 'vue'
import {
  InformationCircleOutline,
  SettingsOutline,
  ConstructOutline,
  DocumentTextOutline
} from '@vicons/ionicons5'
import { IModification, useModificationsStore } from '@/stores/modifications-store.ts'
import { useRoute, useRouter } from 'vue-router'
import { useColorStore } from '@/stores/color-store.ts'
import { setCurrent } from '@/views/parts/create-steps/index.ts'

const isLoading = ref(false)
const categoryStore = useCategoryStore()
const modificationStore = useModificationsStore()
const colorStore = useColorStore()
const route = useRoute()
const router = useRouter()
const form = ref({
  name: '',
  price: 1,
  code: [],
  detail: {
    height: 0,
    width: 0,
    length: 0,
    weight: 0
  },
  eav_attributes: {
    axleConfiguration: 'Передняя',
    bodyType: 'Внедорожник',
    driveType: 'Передние ведущие',
    engineDisplacement: 0,
    fuelType: 'Бензин / электричество',
    gearType: 'Полуавтомат',
    numberOfCycle: 0,
    numberOfValves: 0,
    power: 0,
    capacity: 0,
    steeringType: 'LHD',
    vinCode: null as string | null,
    modelCar: null as number | null
  },
  mileage: 0,
  category: null,
  color: null,
  defect: '',
  comment: ''
})

const bodyTypeOptions = [
  { label: 'Внедорожник', value: 'Внедорожник' },
  { label: 'Купе', value: 'Купе' },
  { label: 'Универсал', value: 'Универсал' },
  { label: 'Кабриолет', value: 'Кабриолет' },
  { label: 'Минивен', value: 'Минивен' },
  { label: 'Пикап', value: 'Пикап' },
  { label: 'Микроавтобус / пассажирский', value: 'Микроавтобус / пассажирский' },
  { label: 'Хэтчбек', value: 'Хэтчбек' },
  { label: 'Коммерческий', value: 'коммерческий' },
  { label: 'Тарга', value: 'Тарга' },
  { label: 'Седан', value: 'Седан' }
]

const axleConfigurationOptions = [
  { label: 'Передняя', value: 'Передняя' },
  { label: 'Задняя', value: 'Задняя' }
]

const driveTypeOptions = [
  { label: 'Передние ведущие', value: 'Передние ведущие' },
  { label: 'Все ведущие', value: 'Все ведущие' },
  { label: 'Задние ведущие', value: 'Задние ведущие' }
]

const fuelTypeOptions = [
  { label: 'Бензин / электричество', value: 'Бензин / электричество' },
  { label: 'LPG', value: 'LPG' },
  { label: 'Электричество', value: 'Электричество' },
  { label: 'Дизель / электричество', value: 'Дизель / электричество' },
  { label: 'Дизель', value: 'Дизель' },
  { label: 'Бензин', value: 'Бензин' }
]

const gearTypeOptions = [
  { label: 'Полуавтомат', value: 'Полуавтомат' },
  { label: 'МКПП', value: 'МКПП' },
  { label: 'АКПП', value: 'АКПП' }
]

const steeringTypeOptions = [
  { label: 'LHD', value: 'LHD' },
  { label: 'RHD', value: 'RHD' }
]

const message = useMessage()

const handleSubmit = () => {
  if (form.value.name == null || form.value.name === '') {
    message.error('Заполните название запчасти')
    return
  }
  isLoading.value = true

  axiosIns
    .post(`/api/admin/product/v2/product/create/`, form.value)
    .then((res) => {
      router.push({ query: { ...route.query, productId: res.data.id } })
      message.success('Запчасть успешно создана')
      setCurrent(4)
    })
    .catch((e) => {
      message.error('Ошибка при создании запчасти')
      throw e
    })
    .finally(() => {
      isLoading.value = false
    })
}

function updateIfNotNull(item: Object, excludeKeys: string[], setRef: any) {
  Object.keys(item).map((key) => {
    if (!excludeKeys.includes(key)) {
      //@ts-ignore
      if (item[key] != undefined || item[key] != null) {
        //@ts-ignore
        setRef.value.eav_attributes[key] = item[key]
      }
    }
  })
}

function updateForm(item: IModification) {
  updateIfNotNull(item, ['id', 'name', 'engines'], form)
  form.value.eav_attributes.modelCar = item.modelCar.id
  if (form.value.eav_attributes.vinCode != null) {
    form.value.eav_attributes.vinCode = form.value.eav_attributes.vinCode!.toString()
  }
}

// Автоматически устанавливаем название запчасти из категории
watch(() => form.value.category, (newCategoryId) => {
  if (newCategoryId) {
    const category = categoryStore.categoriesOptions.find(c => c.value === newCategoryId)
    if (category) {
      form.value.name = category.label
    }
  }
})

onMounted(() => {
  if (route.query.productId != null) {
    setCurrent(4)
  }
  if (route.query.modificationId != null) {
    modificationStore.loadModification(parseInt(route.query.modificationId!.toString())).then((res: any) => {
      updateForm(res)
    })
  }
  colorStore.loadColors()
  categoryStore.loadCategories()
})
</script>
