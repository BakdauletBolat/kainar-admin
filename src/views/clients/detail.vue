<template>
  <div class="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
    <n-page-header class="mb-4" @back="router.back()">
      <template #title>
        Клиент #{{ client?.id }}
      </template>
      <template #subtitle>
        {{ client?.first_name }} {{ client?.last_name }}
      </template>
    </n-page-header>
    <profile-edit-form
      v-if="client"
      v-model="editForm"
      :city-options="cityOptions"
      :role-options="roleOptions"
      :status-options="statusOptions"
      @change="onSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NPageHeader, useMessage } from 'naive-ui'
import ProfileEditForm from '@/components/ProfileEditForm.vue'
import { useClientStore } from '@/stores/client-store.ts'
import axiosIns from '@/apis'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const clientStore = useClientStore()

const client = ref<any>(null)
const editForm = ref<any>({})

const cityOptions = ref<{ label: string, value: any }[]>([])
const roleOptions = ref<{ label: string, value: any }[]>([])
const statusOptions = ref([
  { label: 'Активен', value: 1 },
  { label: 'Неактивен', value: 0 }
])

async function loadClient() {
  const { id } = route.params
  client.value = await clientStore.loadClient(id.toString())
  editForm.value = {
    city: client.value.city.id,
    email: client.value.email,
    first_name: client.value.first_name,
    last_name: client.value.last_name,
    middle_name: client.value.middle_name,
    is_staff: client.value.is_staff,
    is_active: client.value.is_active,
    status: client.value.status,
    roles: client.value.roles?.map((r: any) => r.id) || []
  }
}

async function fetchCities() {
  // Пример запроса, адаптируйте под свой API
  const res = await axiosIns.get('/api/admin/handbook/city/')
  cityOptions.value = res.data.results.map((c: any) => ({
    label: c.name,
    value: c.id
  }))
}

async function fetchRoles() {
  // Пример запроса, адаптируйте под свой API
  const res = await axiosIns.get('/api/users/roles/')
  roleOptions.value = res.data.map((r: any) => ({
    label: r.name,
    value: r.id
  }))
}

async function onSave(val: any) {
  try {
    console.log('Saving client data:', val)
    await clientStore.patchClient(client.value.id, val)
    message.success('Данные клиента обновлены')
    loadClient()
  } catch (e) {
    message.error('Ошибка при сохранении')
  }
}

onMounted(() => {
  loadClient()
  fetchCities()
  fetchRoles()
})
</script>
