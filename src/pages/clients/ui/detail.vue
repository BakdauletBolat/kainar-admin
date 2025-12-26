<template>
  <main class="space-y-5">
    <!-- Breadcrumbs -->
    <n-breadcrumb class="mb-2">
      <n-breadcrumb-item>
        <router-link to="/" class="text-slate-600 hover:text-slate-900 transition-colors">
          Главная
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        <router-link :to="{ name: 'clients-list' }" class="text-slate-600 hover:text-slate-900 transition-colors">
          Клиенты
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        <span class="text-slate-900 font-medium">{{ fullName || 'Детали' }}</span>
      </n-breadcrumb-item>
    </n-breadcrumb>

    <!-- Header Card -->
    <div>
      <div class="rounded-3xl border border-slate-200/80 bg-white px-6 py-5 shadow-sm">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <!-- Левая часть: информация -->
          <div class="space-y-3">
            <div class="flex flex-wrap items-center gap-3">
              <!-- Аватар -->
              <div class="flex items-center justify-center w-16 h-16 rounded-full bg-primary-500 text-white text-2xl font-bold">
                {{ initials }}
              </div>

              <div>
                <p class="text-2xl font-semibold text-slate-900">
                  {{ fullName }}
                </p>
                <span class="text-xs font-semibold text-slate-500">ID {{ client?.id }}</span>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <span v-if="client?.phone" class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
                📱 {{ client.phone }}
              </span>
              <span v-if="client?.email" class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
                ✉️ {{ client.email }}
              </span>
              <span v-if="client?.date_joined" class="text-slate-500">
                Зарегистрирован {{ formatDate(client.date_joined) }}
              </span>
            </div>
          </div>

          <!-- Правая часть: кнопки действий -->
          <div class="flex flex-wrap items-center gap-2">
            <n-button quaternary round @click="router.back()">Назад</n-button>
            <n-button type="primary" round :loading="isLoadingPathClient" @click="onSave">
              Сохранить
            </n-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="!client" class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      <n-skeleton height="420px" width="100%" :sharp="false" />
      <n-skeleton height="420px" width="100%" :sharp="false" />
      <n-skeleton height="420px" width="100%" :sharp="false" />
    </div>

    <!-- Контент -->
    <div v-else class="space-y-4">
      <!-- Основная информация -->
      <n-card size="large">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-slate-900">Основная информация</h3>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Имя</p>
            <n-input v-model:value="editForm.first_name" placeholder="Введите имя" />
          </div>

          <div class="space-y-2">
            <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Фамилия</p>
            <n-input v-model:value="editForm.last_name" placeholder="Введите фамилию" />
          </div>

          <div class="space-y-2">
            <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Отчество</p>
            <n-input v-model:value="editForm.middle_name" placeholder="Введите отчество" />
          </div>

          <div class="space-y-2">
            <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Email</p>
            <n-input v-model:value="editForm.email" type="email" placeholder="email@example.com" />
          </div>

          <div class="space-y-2">
            <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Город</p>
            <n-select
              v-model:value="editForm.city"
              :options="cityOptions"
              placeholder="Выберите город"
              filterable
              clearable
            />
          </div>

          <div class="space-y-2">
            <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Статус</p>
            <n-select
              v-model:value="editForm.status"
              :options="statusOptions"
              placeholder="Выберите статус"
            />
          </div>
        </div>
      </n-card>

      <!-- Роли и права -->
      <n-card size="large">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-slate-900">Роли и права</h3>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Роли</p>
            <n-select
              v-model:value="editForm.roles"
              :options="roleOptions"
              placeholder="Выберите роли"
              multiple
              filterable
            />
          </div>

          <div class="space-y-2">
            <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Сотрудник</p>
            <n-switch v-model:value="editForm.is_staff">
              <template #checked>Да</template>
              <template #unchecked>Нет</template>
            </n-switch>
          </div>

          <div class="space-y-2">
            <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Активен</p>
            <n-switch v-model:value="editForm.is_active">
              <template #checked>Да</template>
              <template #unchecked>Нет</template>
            </n-switch>
          </div>
        </div>
      </n-card>

      <!-- Дополнительная информация -->
      <n-card size="large">
        <h3 class="mb-3 text-lg font-semibold text-slate-900">Дополнительная информация</h3>
        <div class="grid gap-3 sm:grid-cols-2">
          <div class="rounded-2xl bg-slate-50 px-3 py-2">
            <p class="text-xs uppercase tracking-[0.08em] text-slate-500">Дата регистрации</p>
            <p class="text-sm font-semibold text-slate-900">{{ formatDate(client?.date_joined) }}</p>
          </div>

          <div class="rounded-2xl bg-slate-50 px-3 py-2">
            <p class="text-xs uppercase tracking-[0.08em] text-slate-500">Последнее обновление</p>
            <p class="text-sm font-semibold text-slate-900">{{ formatDate(client?.updated_at) }}</p>
          </div>
        </div>
      </n-card>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NCard,
  NInput,
  NSelect,
  NSwitch,
  NButton,
  NBreadcrumb,
  NBreadcrumbItem,
  NSkeleton,
  useMessage
} from 'naive-ui'
import { useClientStore } from '@entities/client'
import axiosIns from '@/shared/api/axios'
import { formatDate } from '@/shared/lib/formatDate'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const clientStore = useClientStore()

const isLoadingPathClient = ref(false)

const client = ref<any>(null)
const editForm = ref<any>({})

const cityOptions = ref<{ label: string, value: any }[]>([])
const roleOptions = ref<{ label: string, value: any }[]>([])
const statusOptions = ref([
  { label: 'Активен', value: 1 },
  { label: 'Неактивен', value: 0 }
])

const fullName = computed(() => {
  if (!client.value) return ''
  return [client.value.first_name, client.value.last_name].filter(Boolean).join(' ')
})

const initials = computed(() => {
  if (!client.value) return '?'
  const first = client.value.first_name?.[0] || ''
  const last = client.value.last_name?.[0] || ''
  return (first + last).toUpperCase() || '?'
})

async function loadClient() {
  const { id } = route.params
  client.value = await clientStore.loadClient(id.toString())
  editForm.value = {
    city: client.value.city?.id,
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

async function onSave() {
  isLoadingPathClient.value = true
  try {
    await clientStore.patchClient(client.value.id, editForm.value)
    message.success('Данные клиента обновлены')
    await loadClient()
  } catch (e) {
    message.error('Ошибка при сохранении')
  } finally {
    isLoadingPathClient.value = false
  }
}

onMounted(() => {
  loadClient()
  fetchCities()
  fetchRoles()
})
</script>
