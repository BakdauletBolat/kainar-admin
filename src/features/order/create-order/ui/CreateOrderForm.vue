<template>
  <n-form
    ref="formRef"
    :model="form"
    :rules="rules"
    label-placement="top"
  >
    <n-form-item label="Клиент" path="client">
      <n-select
        v-model:value="form.client"
        :options="clientOptions"
        filterable
        placeholder="Выберите клиента"
      />
    </n-form-item>

    <n-form-item label="Запчасти" path="parts">
      <n-select
        v-model:value="form.parts"
        :options="partOptions"
        multiple
        filterable
        placeholder="Выберите запчасти"
      />
    </n-form-item>

    <n-form-item label="Способ оплаты" path="payment_method">
      <n-select
        v-model:value="form.payment_method"
        :options="paymentMethods"
        placeholder="Выберите способ оплаты"
      />
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
import { NForm, NFormItem, NSelect, NInput, NButton, NSpace } from 'naive-ui'
import { useOrderStore } from '@entities/order'
import { useClientStore } from '@entities/client'
import { usePartStore } from '@entities/part'
import type { CreateOrderDto } from '@entities/order'

const emit = defineEmits<{
  success: []
  cancel: []
}>()

const orderStore = useOrderStore()
const clientStore = useClientStore()
const partStore = usePartStore()

const formRef = ref()
const isLoading = ref(false)

const form = ref<CreateOrderDto>({
  client: null,
  parts: [],
  payment_method: null,
  comment: ''
})

const rules = {
  client: { required: true, type: 'number', message: 'Выберите клиента', trigger: 'change' },
  parts: { required: true, type: 'array', message: 'Выберите запчасти', trigger: 'change' },
  payment_method: { required: true, message: 'Выберите способ оплаты', trigger: 'change' }
}

const clientOptions = computed(() => {
  return clientStore.clients.map(c => ({
    label: `${c.name} (${c.phone})`,
    value: c.id
  }))
})

const partOptions = computed(() => {
  return partStore.parts.map(p => ({
    label: `${p.name} - ${p.price}₸`,
    value: p.id
  }))
})

const paymentMethods = [
  { label: 'Наличные', value: 'cash' },
  { label: 'Карта', value: 'card' },
  { label: 'Kaspi', value: 'kaspi' },
  { label: 'Рассрочка', value: 'installment' }
]

onMounted(async () => {
  await Promise.all([
    clientStore.loadClients(),
    partStore.loadParts()
  ])
})

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    isLoading.value = true
    await orderStore.createOrder(form.value)
    emit('success')
  } finally {
    isLoading.value = false
  }
}

function handleCancel() {
  emit('cancel')
}
</script>
