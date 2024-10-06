<template>
  <n-page-header @back="handleBack" class="mb-4">
    <template #title>
      Создание
    </template>
  </n-page-header>
  <main>
    <n-form :model="form" ref="formRef" label-width="120px">
      <div class="grid grid-cols-2 gap-4">
        <!-- Левая колонка -->
        <div>
          <n-form-item label="Название">
            <n-input v-model:value="form.name" placeholder="Введите название продукта" />
          </n-form-item>

          <n-form-item label="Цена">
            <n-input-number v-model:value="form.price" placeholder="Введите цену" />
          </n-form-item>

          <n-form-item label="Код">
            <n-dynamic-input v-model:value="form.code" placeholder="Добавьте код" />
          </n-form-item>

          <n-form-item label="Объем двигателя">
            <n-input v-model:value="form.eav_attributes.engineDisplacement" placeholder="Введите объем двигателя" />
          </n-form-item>

          <n-form-item label="Пробег">
            <n-input-number v-model:value="form.mileage" placeholder="Введите пробег" />
          </n-form-item>

          <n-form-item label="Категория">
            <n-select v-model:value="form.category" :options="categoryStore.categoriesOptions"
              placeholder="Введите категорию" />
          </n-form-item>

          <n-form-item label="Цвет">
            <n-input-number v-model:value="form.color" placeholder="Введите цвет" />
          </n-form-item>
        </div>

        <!-- Правая колонка -->
        <div>
          <n-form-item label="Тип кузова">
            <n-select v-model:value="form.eav_attributes.bodyType" :options="bodyTypeOptions"
              placeholder="Выберите тип кузова" />
          </n-form-item>

          <n-form-item label="Конфигурация оси">
            <n-select v-model:value="form.eav_attributes.axleConfiguration" :options="axleConfigurationOptions"
              placeholder="Выберите конфигурацию оси" />
          </n-form-item>

          <n-form-item label="Привод">
            <n-select v-model:value="form.eav_attributes.driveType" :options="driveTypeOptions"
              placeholder="Выберите тип привода" />
          </n-form-item>

          <n-form-item label="Топливо">
            <n-select v-model:value="form.eav_attributes.fuelType" :options="fuelTypeOptions"
              placeholder="Выберите тип топлива" />
          </n-form-item>

          <n-form-item label="Коробка передач">
            <n-select v-model:value="form.eav_attributes.gearType" :options="gearTypeOptions"
              placeholder="Выберите коробку передач" />
          </n-form-item>

          <n-form-item label="Рулевое управление">
            <n-select v-model:value="form.eav_attributes.steeringType" :options="steeringTypeOptions"
              placeholder="Выберите тип рулевого управления" />
          </n-form-item>

          <n-form-item label="VIN код">
            <n-input v-model:value="form.eav_attributes.vinCode" placeholder="Введите VIN код" />
          </n-form-item>
        </div>
      </div>

      <!-- Третья строка с textarea и кнопками -->
      <div class="grid grid-cols-1 gap-4 mt-4">
        <n-form-item label="Дефект">
          <n-input v-model:value="form.defect" type="textarea" placeholder="Опишите дефект" />
        </n-form-item>

        <n-form-item label="Комментарий">
          <n-input v-model:value="form.comment" type="textarea" placeholder="Введите комментарий" />
        </n-form-item>

        <div class="flex justify-end">
          <n-button type="primary" @click="handleSubmit">Сохранить</n-button>
        </div>
      </div>
    </n-form>
  </main>
</template>
<script setup lang="ts">
import axiosIns from "@/apis";
import router from "@/routers";
import { useCategoryStore } from "@/stores/category-storage";
import { NPageHeader, useMessage, NForm, NFormItem, NButton, NSelect, NInput, NInputNumber, NDynamicInput } from "naive-ui";
import { onMounted, ref } from 'vue'

const categoryStore = useCategoryStore();

const form = ref({
  name: '',
  price: 0,
  code: [''],
  detail: {
    height: 0,
    width: 0,
    length: 0,
    weight: 0
  },
  eav_attributes: {
    axleConfiguration: "Передняя",
    bodyType: 'Внедорожник',
    capacity: 100.1,
    driveType: 'Передние ведущие',
    engineDisplacement: 1233.1,
    fuelType: 'Бензин / электричество',
    gearType: 'Полуавтомат',
    numberOfCycle: 10,
    numberOfValves: 10,
    power: 10,
    steeringType: 'LHD',
    vinCode: ''
  },
  mileage: 0,
  category: null,
  color: 0,
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
  { label: 'коммерческий', value: 'коммерческий' },
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
  message.success('Продукт сохранен!')
  axiosIns.post(`/api/v2/product/create/`, form.value).then(res => console.log(res)).catch(e => console.log(e))
}

onMounted(() => {
  categoryStore.loadCategories();
})

function handleBack() {
  router.back();
}

</script>