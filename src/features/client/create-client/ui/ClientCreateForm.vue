<template>
  <n-form
    :model="form"
    label-placement="top"
    class="space-y-4"
    @submit.prevent="emitCreate"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <n-form-item label="Имя" path="first_name">
        <n-input v-model:value="form.first_name" placeholder="Введите имя" />
      </n-form-item>
      <n-form-item label="Фамилия" path="last_name">
        <n-input v-model:value="form.last_name" placeholder="Введите фамилию" />
      </n-form-item>
      <n-form-item label="Отчество" path="middle_name">
        <n-input v-model:value="form.middle_name" placeholder="Введите отчество" />
      </n-form-item>
      <n-form-item label="Email" path="email">
        <n-input v-model:value="form.email" placeholder="Введите email" />
      </n-form-item>
      <n-form-item label="Телефон" path="phone">
        <n-input v-model:value="form.phone" placeholder="Введите номер телефона" />
      </n-form-item>
      <n-form-item label="Город" path="city">
        <n-select
          v-model:value="form.city"
          :options="cityOptions"
          placeholder="Выберите город"
          filterable
          clearable
        />
      </n-form-item>
      <n-form-item label="Роль" path="roles">
        <n-select
          v-model:value="form.roles"
          :options="roleOptions"
          placeholder="Выберите роль"
          multiple
          filterable
        />
      </n-form-item>
      <n-form-item label="Статус" path="status">
        <n-select
          v-model:value="form.status"
          :options="statusOptions"
          placeholder="Выберите статус"
        />
      </n-form-item>
      <n-form-item label="Сотрудник" path="is_staff">
        <n-switch v-model:value="form.is_staff" />
      </n-form-item>
      <n-form-item label="Активен" path="is_active">
        <n-switch v-model:value="form.is_active" />
      </n-form-item>
      <n-form-item label="Пароль" path="password">
        <n-input v-model:value="form.password" type="password" show-password-on="mousedown" placeholder="Введите пароль" />
      </n-form-item>
      <n-form-item label="Подтверждение пароля" path="password2">
        <n-input v-model:value="form.password2" type="password" show-password-on="mousedown" placeholder="Повторите пароль" />
      </n-form-item>
    </div>
    <div class="flex justify-end gap-2 mt-4">
      <n-button type="primary" @click="emitCreate">Создать клиента</n-button>
    </div>
  </n-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NForm, NFormItem, NInput, NSelect, NButton, NSwitch } from 'naive-ui'

defineProps<{
  cityOptions?: { label: string, value: any }[],
  roleOptions?: { label: string, value: any }[],
  statusOptions?: { label: string, value: any }[]
}>()

const emit = defineEmits(['create'])

const form = ref({
  city: null,
  email: '',
  first_name: '',
  last_name: '',
  middle_name: '',
  phone: '',
  password: '',
  password2: '',
  is_staff: false,
  is_active: true,
  status: 1,
  roles: []
})

function emitCreate() {
  emit('create', { ...form.value })
}
</script>
