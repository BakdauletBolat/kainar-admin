<template>
  <n-form
    ref="formRef"
    :model="form"
    :rules="rules"
    label-placement="top"
  >
    <n-form-item label="Имя" path="name">
      <n-input v-model:value="form.name" placeholder="Введите имя клиента" />
    </n-form-item>

    <n-form-item label="Телефон" path="phone">
      <n-input v-model:value="form.phone" placeholder="+7 (XXX) XXX-XX-XX" />
    </n-form-item>

    <n-form-item label="Email" path="email">
      <n-input v-model:value="form.email" type="email" placeholder="email@example.com" />
    </n-form-item>

    <n-form-item label="Адрес" path="address">
      <n-input v-model:value="form.address" placeholder="Введите адрес" />
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
import { useClientStore } from '@entities/client'
import type { CreateClientDto } from '@entities/client'

const emit = defineEmits<{
  success: []
  cancel: []
}>()

const clientStore = useClientStore()

const formRef = ref()
const isLoading = ref(false)

const form = ref<CreateClientDto>({
  name: '',
  phone: '',
  email: '',
  address: '',
  comment: ''
})

const rules = {
  name: { required: true, message: 'Введите имя', trigger: 'blur' },
  phone: { required: true, message: 'Введите телефон', trigger: 'blur' }
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    isLoading.value = true
    await clientStore.createClient(form.value)
    emit('success')
  } finally {
    isLoading.value = false
  }
}

function handleCancel() {
  emit('cancel')
}
</script>
