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
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import axiosIns from '@/apis';
import { type FormInst, NPageHeader, NButton, NCard, NInput, NForm, NFormItem, NSelect, useMessage } from "naive-ui";


const formRef = ref<FormInst | null>(null);

const isLoading = ref(false);
const router = useRouter();
const message = useMessage();

const cityOptions = [
  {
    label: "Шымкент",
    value: 3
  }, {
    label: "Астана",
    value: 4
  }
]

const create = (values: any) => {
  isLoading.value = true;
  axiosIns.post("/api/stock/warehouses/", values).then((_: any) => {
    message.success('Успешно создано')
    router.push({
      name: 'warehouses-list'
    })
  }).finally(() => {
    isLoading.value = false;
  });
}

const formValue = reactive({
  name: '',
  city_id: 3
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
  }
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