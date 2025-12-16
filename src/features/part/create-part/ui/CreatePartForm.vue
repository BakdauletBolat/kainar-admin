<template>
  <n-form
    ref="formRef"
    :model="form"
    :rules="rules"
    label-placement="top"
  >
    <n-form-item label="Название" path="name">
      <n-input v-model:value="form.name" placeholder="Введите название" />
    </n-form-item>

    <n-form-item label="Артикул" path="article">
      <n-input v-model:value="form.article" placeholder="Введите артикул" />
    </n-form-item>

    <n-form-item label="Цена" path="price">
      <n-input-number v-model:value="form.price" :min="0" style="width: 100%" />
    </n-form-item>

    <n-form-item label="Категория" path="category">
      <n-tree-select
        v-model:value="form.category"
        :options="categoryOptions"
        placeholder="Выберите категорию"
      />
    </n-form-item>

    <n-form-item label="Склад" path="warehouse">
      <n-select
        v-model:value="form.warehouse"
        :options="warehouseOptions"
        placeholder="Выберите склад"
      />
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
import { ref, computed, onMounted } from 'vue'
import { NForm, NFormItem, NInput, NInputNumber, NTreeSelect, NSelect, NButton, NSpace } from 'naive-ui'
import { usePartStore } from '@entities/part'
import { useCategoryStore, buildCategoryTree } from '@entities/category'
import { useWarehouseStore } from '@entities/warehouse'
import type { CreatePartDto } from '@entities/part'

const emit = defineEmits<{
  success: []
  cancel: []
}>()

const partStore = usePartStore()
const categoryStore = useCategoryStore()
const warehouseStore = useWarehouseStore()

const formRef = ref()
const isLoading = ref(false)

const form = ref<CreatePartDto>({
  name: '',
  article: '',
  price: 0,
  category: null,
  warehouse: null,
  description: ''
})

const rules = {
  name: { required: true, message: 'Введите название', trigger: 'blur' },
  article: { required: true, message: 'Введите артикул', trigger: 'blur' },
  price: { required: true, type: 'number', message: 'Введите цену', trigger: 'blur' },
  category: { required: true, type: 'number', message: 'Выберите категорию', trigger: 'change' },
  warehouse: { required: true, type: 'number', message: 'Выберите склад', trigger: 'change' }
}

const categoryOptions = computed(() => {
  return buildCategoryTree(categoryStore.categoriesTree)
})

const warehouseOptions = computed(() => {
  return warehouseStore.warehouses.map(w => ({
    label: w.name,
    value: w.id
  }))
})

onMounted(async () => {
  await Promise.all([
    categoryStore.loadCategoriesTree(),
    warehouseStore.loadWarehouses()
  ])
})

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    isLoading.value = true
    await partStore.createPart(form.value)
    emit('success')
  } finally {
    isLoading.value = false
  }
}

function handleCancel() {
  emit('cancel')
}
</script>
