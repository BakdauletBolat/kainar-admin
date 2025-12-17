<template>
  <main class="space-y-5 max-w-4xl mx-auto">
    <!-- Breadcrumbs -->
    <n-breadcrumb class="mb-2">
      <n-breadcrumb-item>
        <router-link to="/" class="text-slate-600 hover:text-slate-900 transition-colors">
          Главная
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        <span class="text-slate-900 font-medium">Профиль</span>
      </n-breadcrumb-item>
    </n-breadcrumb>

    <!-- Header Card -->
    <div class="rounded-3xl border border-slate-200/80 bg-white px-6 py-5 shadow-sm">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <!-- Левая часть: информация о профиле -->
        <div class="flex items-center gap-4">
          <div class="flex items-center justify-center w-16 h-16 rounded-full bg-primary-500 text-white text-2xl font-bold">
            {{ initials }}
          </div>
          <div>
            <div class="text-2xl font-semibold text-slate-900">{{ fullName }}</div>
            <div class="text-sm text-slate-600">{{ authStore.user?.roles?.[0]?.name || 'Без роли' }}</div>
            <div class="text-xs text-slate-500 mt-1">ID: {{ authStore.user?.id }}</div>
          </div>
        </div>

        <!-- Правая часть: кнопка выхода -->
        <n-button type="error" secondary round @click="logout">
          Выйти из аккаунта
        </n-button>
      </div>
    </div>

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
      </div>

      <div class="flex justify-end mt-6">
        <n-button
          type="primary"
          round
          size="large"
          :disabled="authStore.isLoading"
          :loading="authStore.isLoading"
          @click="onSave"
          class="font-medium"
        >
          Сохранить изменения
        </n-button>
      </div>
    </n-card>

    <!-- Роли и права (только для отображения) -->
    <n-card size="large">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-900">Роли и права</h3>
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <div class="rounded-2xl bg-slate-50 px-3 py-2">
          <p class="text-xs uppercase tracking-[0.08em] text-slate-500">Роли</p>
          <div class="flex flex-wrap gap-2 mt-2">
            <span
              v-for="role in authStore.user?.roles"
              :key="role.id"
              class="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700"
            >
              {{ role.name }}
            </span>
            <span v-if="!authStore.user?.roles?.length" class="text-sm text-slate-500">—</span>
          </div>
        </div>

        <div class="rounded-2xl bg-slate-50 px-3 py-2">
          <p class="text-xs uppercase tracking-[0.08em] text-slate-500">Статус</p>
          <div class="flex items-center gap-2 mt-2">
            <span
              :class="[
                'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                authStore.user?.is_staff ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
              ]"
            >
              {{ authStore.user?.is_staff ? 'Сотрудник' : 'Не сотрудник' }}
            </span>
            <span
              :class="[
                'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                authStore.user?.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              ]"
            >
              {{ authStore.user?.is_active ? 'Активен' : 'Неактивен' }}
            </span>
          </div>
        </div>
      </div>
    </n-card>
  </main>
</template>

<script lang="ts" setup>
import { onMounted, computed, ref } from "vue";
import { useAuthStore } from "@/stores/auth-store.ts";
import { NButton, NCard, NInput, NSelect, NBreadcrumb, NBreadcrumbItem, useMessage } from 'naive-ui';
import { useRouter } from "vue-router";
import axiosIns from '@/apis';

const authStore = useAuthStore();
const router = useRouter();
const message = useMessage();

const fullName = computed(() => {
  const u = authStore.user;
  if (!u) return '';
  return [u.last_name, u.first_name, u.middle_name].filter(Boolean).join(' ');
});

const initials = computed(() => {
  const u = authStore.user;
  if (!u) return '';
  return [u.first_name, u.last_name].map(n => n?.[0] || '').join('').toUpperCase();
});

const editForm = ref<any>({});
const cityOptions = ref<{ label: string, value: any }[]>([]);

async function fetchCities() {
  const res = await axiosIns.get('/api/admin/handbook/city/');
  cityOptions.value = res.data.results.map((c: any) => ({ label: c.name, value: c.id }));
}

async function onSave() {
  try {
    await authStore.updateProfile(editForm.value);
    message.success('Профиль обновлен');
    await authStore.userMe();
  } catch (e) {
    message.error('Ошибка при сохранении профиля');
  }
}

async function logout() {
  await authStore.logout();
  await router.push("/login");
}

onMounted(async () => {
  await authStore.userMe();
  await fetchCities();
  if (authStore.user) {
    editForm.value = {
      status: 1,
      city: authStore.user.city?.id,
      email: authStore.user.email,
      first_name: authStore.user.first_name,
      last_name: authStore.user.last_name,
      middle_name: authStore.user.middle_name,
      is_staff: authStore.user.is_staff,
      is_active: authStore.user.is_active,
      roles: authStore.user.roles?.map((r: any) => r.id) || []
    };
  }
})
</script>
