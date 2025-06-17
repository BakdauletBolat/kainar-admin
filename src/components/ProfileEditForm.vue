<template>
  <n-form
    :model="form"
    label-placement="top"
    class="space-y-4"
    @submit.prevent="emitChanges"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <n-form-item label="Имя" path="first_name">
        <n-input v-model:value="form.first_name" />
      </n-form-item>
      <n-form-item label="Фамилия" path="last_name">
        <n-input v-model:value="form.last_name" />
      </n-form-item>
      <n-form-item label="Отчество" path="middle_name">
        <n-input v-model:value="form.middle_name" />
      </n-form-item>
      <n-form-item label="Email" path="email">
        <n-input v-model:value="form.email" />
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
    </div>
    <div class="flex justify-end gap-2 mt-4">
      <n-button type="primary" @click="emitChanges">Сохранить</n-button>
    </div>
  </n-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { NForm, NFormItem, NInput, NSelect, NButton, NSwitch } from 'naive-ui'

const props = defineProps<{
  modelValue: {
    city: any,
    email: string,
    first_name: string,
    last_name: string,
    middle_name: string,
    is_staff: boolean,
    is_active: boolean,
    status: number,
    roles: any[]
  },
  cityOptions?: { label: string, value: any }[],
  roleOptions?: { label: string, value: any }[],
  statusOptions?: { label: string, value: any }[]
}>()

const emit = defineEmits(['update:modelValue', 'change'])

const form = ref({ ...props.modelValue })

watch(() => props.modelValue, (val) => {
  form.value = { ...val }
})

function emitChanges() {
  emit('update:modelValue', { ...form.value })
  emit('change', { ...form.value })
}
</script>
