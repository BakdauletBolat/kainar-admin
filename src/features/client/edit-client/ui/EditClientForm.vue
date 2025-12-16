<template>
  <n-spin :show="isLoadingClient">
    <n-form
      v-if="form"
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
import { useClientStore } from '@entities/client'
import type { UpdateClientDto } from '@entities/client'

interface Props {
  clientId: number | string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  success: []
  cancel: []
}>()

const clientStore = useClientStore()

const formRef = ref()
const isLoadingClient = ref(false)
const isLoadingUpdate = ref(false)

const form = ref<UpdateClientDto | null>(null)

const rules = {
  name: { required: true, message: 'Введите имя', trigger: 'blur' },
  phone: { required: true, message: 'Введите телефон', trigger: 'blur' }
}

onMounted(async () => {
  isLoadingClient.value = true
  try {
    await loadClient()
  } finally {
    isLoadingClient.value = false
  }
})

async function loadClient() {
  const client = await clientStore.loadClientById(props.clientId)
  if (!client) {
    return
  }
  form.value = {
    name: client.name,
    phone: client.phone,
    email: client.email || '',
    address: client.address || '',
    comment: client.comment || ''
  }
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    isLoadingUpdate.value = true
    await clientStore.updateClient(props.clientId, form.value!)
    emit('success')
  } finally {
    isLoadingUpdate.value = false
  }
}

function handleCancel() {
  emit('cancel')
}
</script>
