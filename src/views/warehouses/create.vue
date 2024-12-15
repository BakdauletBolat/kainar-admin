<template>
  <main>
    <n-page-header @back="handleBack" class="mb-4">
      <template #title>
        Создание
      </template>
    </n-page-header>
    <n-card>
      <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules" :size="'medium'">
        <n-form-item label="Название" path="name">
          <n-input v-model:value="formValue.name" placeholder="Навазния" />
        </n-form-item>
        <n-form-item label="Город" path="city_id">
          <n-select v-model:value="formValue.city_id" placeholder="Выбрать город" :options="cityOptions" />
        </n-form-item>
        <n-form-item label="Категория" path="category_ids">
          <n-select v-model:value="formValue.category_ids" filterable
                    multiple
                    placeholder="Выбрать категории"
                    :options="categoryStore.categoriesOptions" />
        </n-form-item>
        <n-form-item label="Минимальный остаток" path="min_stock_level">
          <n-input-number v-model:value="formValue.min_stock_level"
                    placeholder="Укажите минимальный остаток"/>
        </n-form-item>
        <n-form-item>
          <n-button type="primary" round @click="handleValidateClick">
            Сохранить
          </n-button>
        </n-form-item>
      </n-form>
    </n-card>
  </main>
</template>
<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue';
import { useRouter } from 'vue-router';
import axiosIns from '@/apis';
import { type FormInst, NPageHeader, NButton, NCard, NInput, NForm,
  NFormItem, NSelect, useMessage, NInputNumber } from "naive-ui";
import {useCategoryStore} from "@/stores/category-storage.ts";


const formRef = ref<FormInst | null>(null);

const isLoading = ref(false);
const router = useRouter();
const message = useMessage();
const categoryStore = useCategoryStore()

const cityOptions = [
  {
    label: "Шымкент",
    value: 3
  }, {
    label: "Астана",
    value: 4
  }
]


const formValue = reactive({
  name: '',
  city_id: 3,
  min_stock_level: 20,
  category_ids: []
})

const rules: any = {
  name: {
    required: true,
    message: 'Названия обязательно',
    trigger: 'blur'
  },
  city_id: {
    type: 'number',
    required: true,
    message: 'ASDASD',
    trigger: 'blur'
  },
  min_stock_level: {
    type: 'number',
    required: false,
    message: 'ASDASD',
    trigger: 'blur'
  },
  category_ids: {
    type: 'array',
    required: false,
    message: 'Выбрать категорию обязательно',
    trigger: 'blur'
  }
}


onMounted(()=>{
  categoryStore.loadCategories();
})

const create = (values: any) => {
  isLoading.value = true;
  axiosIns.post("/api/stock/warehouses/", values).then((_: any) => {
    message.success('Успешно создано')
    router.push({
      name: 'warehouses-list'
    })
  }).catch(e=>{
    throw e;
  }).finally(() => {
    isLoading.value = false;
  });
}

function handleValidateClick(e: any) {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      create(formValue)
    }
    else {
      message.error('Invalid')
    }
  })
}

function handleBack() {
  router.back();
}
</script>