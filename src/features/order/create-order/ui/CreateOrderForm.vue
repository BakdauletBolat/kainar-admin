<template>
  <n-form
    ref="formRef"
    :model="form"
    :rules="rules"
    label-placement="top"
  >
  <n-form-item label="Запчасти" path="parts">
    <n-select
      v-model:value="form.parts"
      :options="partOptions"
      multiple
        filterable
        placeholder="Выберите запчасти"
      />
    </n-form-item>

  <n-form-item label="Тип доставки" path="delivery_type_id">
    <n-select
      v-model:value="form.delivery_type_id"
      :options="deliveryTypeOptions"
      placeholder="Выберите тип доставки"
    />
  </n-form-item>

  <n-form-item label="Тип оплаты" path="payment_type_id">
    <n-select
      v-model:value="form.payment_type_id"
      :options="paymentTypeOptions"
      placeholder="Выберите тип оплаты"
    />
  </n-form-item>

  <n-form-item label="Склад" path="warehouse_id">
    <n-select
      v-model:value="form.warehouse_id"
      :options="warehouseOptions"
      filterable
      placeholder="Выберите склад"
    />
  </n-form-item>

  <n-form-item label="Имя" path="first_name">
    <n-input v-model:value="form.first_name" placeholder="Введите имя клиента" />
  </n-form-item>

  <n-form-item label="Телефон" path="phone_number">
    <n-input v-model:value="form.phone_number" placeholder="+7 (XXX) XXX-XX-XX" />
  </n-form-item>

  <n-form-item label="Email" path="email">
    <n-input v-model:value="form.email" type="email" placeholder="email@example.com" />
  </n-form-item>

  <n-form-item label="Скидка" path="discount">
    <n-input-number v-model:value="form.discount" :min="0" style="width: 100%" />
  </n-form-item>

  <n-form-item label="Комментарий" path="comment">
    <n-input
      v-model:value="form.comment"
        type="textarea"
        placeholder="Введите комментарий"
        :rows="3"
      />
    </n-form-item>

    <n-space>
      <n-button type="primary" :loading="isLoading" @click="handleSubmit">
        Создать заказ
      </n-button>
      <n-button @click="handleCancel">
        Отмена
      </n-button>
    </n-space>
  </n-form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { NForm, NFormItem, NSelect, NInput, NInputNumber, NButton, NSpace } from 'naive-ui'
import { useOrderStore } from '@entities/order'
import { usePartStore } from '@entities/part'
import { useWarehouseStore } from '@entities/warehouse'
import type { CreateOrderData } from '@entities/order'

interface CreateOrderFormModel {
  parts: number[]
  delivery_type_id: number | null
  payment_type_id: number | null
  warehouse_id: number | null
  comment: string
  discount: number
  first_name: string
  phone_number: string
  email: string
}

const emit = defineEmits<{
  success: []
  cancel: []
}>()

const orderStore = useOrderStore()
const partStore = usePartStore()
const warehouseStore = useWarehouseStore()

const formRef = ref()
const isLoading = ref(false)

const form = ref<CreateOrderFormModel>({
  parts: [],
  delivery_type_id: null,
  payment_type_id: null,
  warehouse_id: null,
  comment: '',
  discount: 0,
  first_name: '',
  phone_number: '',
  email: ''
})

const rules = {
  parts: { required: true, type: 'array', message: 'Выберите запчасти', trigger: 'change' },
  delivery_type_id: { required: true, type: 'number', message: 'Выберите тип доставки', trigger: 'change' },
  payment_type_id: { required: true, type: 'number', message: 'Выберите тип оплаты', trigger: 'change' },
  warehouse_id: { required: true, type: 'number', message: 'Выберите склад', trigger: 'change' },
  first_name: { required: true, message: 'Введите имя', trigger: 'blur' },
  phone_number: { required: true, message: 'Введите телефон', trigger: 'blur' },
  email: { type: 'email', message: 'Некорректный email', trigger: ['blur', 'change'] }
}

const partOptions = computed(() => {
  return partStore.parts.map(p => ({
    label: `${p.name} - ${p.price}₸`,
    value: p.id
  }))
})

const warehouseOptions = computed(() => {
  return warehouseStore.warehouses.map(w => ({
    label: w.name,
    value: Number(w.id)
  }))
})

const deliveryTypeOptions = [
  { label: 'Курьер', value: 1 },
  { label: 'Самовывоз', value: 2 }
]

const paymentTypeOptions = [
  { label: 'Наличные', value: 1 },
  { label: 'Карта', value: 2 }
]

onMounted(async () => {
  await Promise.all([
    partStore.loadParts(),
    warehouseStore.loadWarehouses({ pageSize: 100 })
  ])
})

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    isLoading.value = true
    const payload: CreateOrderData = {
      goods: form.value.parts.map(id => ({
        product_id: id,
        quality_id: 1,
        quantity: 1
      })),
      delivery_type_id: form.value.delivery_type_id as number,
      payment_type_id: form.value.payment_type_id as number,
      warehouse_id: form.value.warehouse_id as number,
      comment: form.value.comment,
      discount: form.value.discount,
      first_name: form.value.first_name,
      phone_number: form.value.phone_number,
      email: form.value.email
    }
    await orderStore.createOrder(payload)
    emit('success')
  } finally {
    isLoading.value = false
  }
}

function handleCancel() {
  emit('cancel')
}
</script>
