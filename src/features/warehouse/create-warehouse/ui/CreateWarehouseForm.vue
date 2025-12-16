<template>
  <n-form
    ref="formRef"
    :model="form"
    :rules="rules"
    label-placement="top"
  >
    <n-form-item label="Название" path="name">
      <n-input v-model:value="form.name" placeholder="Введите название склада" />
    </n-form-item>

    <n-form-item label="Адрес" path="address">
      <n-input v-model:value="form.address" placeholder="Введите адрес" />
    </n-form-item>

    <n-form-item label="Описание" path="description">
      <n-input
        v-model:value="form.description"
        type="textarea"
        placeholder="Введите описание"
        :rows="3"
      />
    </n-form-item>

    <n-space>
      <n-button type="primary" :loading="isLoading" @click="handleSubmit">
        Создать
      </n-button>
      <n-button @click="handleCancel">
        Отмена
      </n-button>
    </n-space>
  </n-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NForm, NFormItem, NInput, NButton, NSpace } from 'naive-ui'
import { useWarehouseStore } from '@entities/warehouse'
import type { CreateWarehouseDto } from '@entities/warehouse'

const emit = defineEmits<{
  success: []
  cancel: []
}>()

const warehouseStore = useWarehouseStore()

const formRef = ref()
const isLoading = ref(false)

const form = ref<CreateWarehouseDto>({
  name: '',
  address: '',
  description: ''
})

const rules = {
  name: { required: true, message: 'Введите название', trigger: 'blur' },
  address: { required: true, message: 'Введите адрес', trigger: 'blur' }
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    isLoading.value = true
    await warehouseStore.createWarehouse(form.value)
    emit('success')
  } finally {
    isLoading.value = false
  }
}

function handleCancel() {
  emit('cancel')
}
</script>
