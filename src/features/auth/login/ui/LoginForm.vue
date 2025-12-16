<template>
  <n-form
    ref="formRef"
    :model="form"
    :rules="rules"
    label-placement="top"
  >
    <n-form-item label="Email" path="email">
      <n-input v-model:value="form.email" type="email" placeholder="Введите email" />
    </n-form-item>

    <n-form-item label="Пароль" path="password">
      <n-input
        v-model:value="form.password"
        type="password"
        show-password-on="click"
        placeholder="Введите пароль"
      />
    </n-form-item>

    <n-button
      type="primary"
      block
      :loading="isLoading"
      @click="handleSubmit"
    >
      Войти
    </n-button>
  </n-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NForm, NFormItem, NInput, NButton } from 'naive-ui'
import { useUserStore } from '@entities/user'

const userStore = useUserStore()
const router = useRouter()

const formRef = ref()
const isLoading = ref(false)

const form = ref({
  email: '',
  password: ''
})

const rules = {
  email: [
    { required: true, message: 'Введите email', trigger: 'blur' },
    { type: 'email', message: 'Некорректный email', trigger: 'blur' }
  ],
  password: { required: true, message: 'Введите пароль', trigger: 'blur' }
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    isLoading.value = true
    await userStore.login(form.value)
    router.push('/')
  } finally {
    isLoading.value = false
  }
}
</script>
