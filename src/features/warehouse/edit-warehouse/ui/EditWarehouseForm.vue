<template>
  <n-spin :show="isLoadingWarehouse">
    <n-form
      v-if="form"
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
        <n-button type="primary" :loading="isLoadingUpdate" @click="handleSubmit">
          Сохранить
        </n-button>
        <n-button @click="handleCancel">
          Отмена
        </n-button>
      </n-space>
    </n-form>
  </n-spin>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NForm, NFormItem, NInput, NButton, NSpace, NSpin } from 'naive-ui'
import { useWarehouseStore } from '@entities/warehouse'
import type { UpdateWarehouseDto } from '@entities/warehouse'

interface Props {
  warehouseId: number | string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  success: []
  cancel: []
}>()

const warehouseStore = useWarehouseStore()

const formRef = ref()
const isLoadingWarehouse = ref(false)
const isLoadingUpdate = ref(false)

const form = ref<UpdateWarehouseDto | null>(null)

const rules = {
  name: { required: true, message: 'Введите название', trigger: 'blur' },
  address: { required: true, message: 'Введите адрес', trigger: 'blur' }
}

onMounted(async () => {
  isLoadingWarehouse.value = true
  try {
    await loadWarehouse()
  } finally {
    isLoadingWarehouse.value = false
  }
})

async function loadWarehouse() {
  const warehouse = await warehouseStore.loadWarehouseById(props.warehouseId)
  form.value = {
    name: warehouse.name,
    address: warehouse.address,
    description: warehouse.description || ''
  }
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    isLoadingUpdate.value = true
    await warehouseStore.updateWarehouse(props.warehouseId, form.value!)
    emit('success')
  } finally {
    isLoadingUpdate.value = false
  }
}

function handleCancel() {
  emit('cancel')
}
</script>
