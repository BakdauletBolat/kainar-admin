<template>
  <n-spin :show="isLoadingPart">
    <n-form
      v-if="form"
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
import { ref, computed, onMounted } from 'vue'
import { NForm, NFormItem, NInput, NInputNumber, NTreeSelect, NSelect, NButton, NSpace, NSpin } from 'naive-ui'
import { usePartStore } from '@entities/part'
import { useCategoryStore, buildCategoryTree } from '@entities/category'
import { useWarehouseStore } from '@entities/warehouse'
import type { UpdatePartDto } from '@entities/part'

interface Props {
  partId: number | string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  success: []
  cancel: []
}>()

const partStore = usePartStore()
const categoryStore = useCategoryStore()
const warehouseStore = useWarehouseStore()

const formRef = ref()
const isLoadingPart = ref(false)
const isLoadingUpdate = ref(false)

const form = ref<UpdatePartDto | null>(null)

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
  isLoadingPart.value = true
  try {
    await Promise.all([
      categoryStore.loadCategoriesTree(),
      warehouseStore.loadWarehouses(),
      loadPart()
    ])
  } finally {
    isLoadingPart.value = false
  }
})

async function loadPart() {
  const part = await partStore.loadPartById(props.partId)
  form.value = {
    name: part.name,
    article: part.article,
    price: part.price,
    category: part.category.id,
    warehouse: part.warehouse.id,
    description: part.description || ''
  }
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    isLoadingUpdate.value = true
    await partStore.updatePart(props.partId, form.value!)
    emit('success')
  } finally {
    isLoadingUpdate.value = false
  }
}

function handleCancel() {
  emit('cancel')
}
</script>
