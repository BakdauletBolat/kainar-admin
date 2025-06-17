<template>
  <div class="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
    <n-page-header class="mb-4" @back="router.back()">
      <template #title>
        Новый клиент
      </template>
    </n-page-header>
    <client-create-form
      :city-options="cityOptions"
      :role-options="roleOptions"
      :status-options="statusOptions"
      @create="onSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NPageHeader, useMessage } from 'naive-ui'
import ClientCreateForm from '@/components/ClientCreateForm.vue'
import axiosIns from '@/apis'

const router = useRouter()
const message = useMessage()

const cityOptions = ref<{ label: string, value: any }[]>([])
const roleOptions = ref<{ label: string, value: any }[]>([])
const statusOptions = ref([
  { label: 'Активен', value: 1 },
  { label: 'Неактивен', value: 0 }
])

async function fetchCities() {
  const res = await axiosIns.get('/api/admin/handbook/city/')
  cityOptions.value = res.data.results.map((c: any) => ({
    label: c.name,
    value: c.id
  }))
}

async function fetchRoles() {
  const res = await axiosIns.get('/api/users/roles/')
  roleOptions.value = res.data.map((r: any) => ({
    label: r.name,
    value: r.id
  }))
}

async function onSave(val: any) {
  if (val.password !== val.password2) {
    message.error('Пароли не совпадают')
    return
  }
  try {
    await axiosIns.post('/api/users/', val)
    message.success('Клиент успешно создан')
    router.push({ name: 'clients-list' })
  } catch (e) {
    message.error('Ошибка при создании клиента')
  }
}

onMounted(() => {
  fetchCities()
  fetchRoles()
})
</script>
