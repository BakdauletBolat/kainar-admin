<template>
  <div class="max-w-xl mx-auto mt-8 p-6 bg-white rounded-lg shadow flex flex-col gap-6">
    <div class="flex items-center gap-4">
      <div class="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white text-2xl font-bold uppercase">
        {{ initials }}
      </div>
      <div>
        <div class="text-xl font-semibold">{{ fullName }}</div>
        <div class="text-gray-500">{{ authStore.user?.roles?.[0]?.name || 'Без роли' }}</div>
        <div class="text-xs text-gray-400 mt-1">ID: {{ authStore.user?.id }}</div>
      </div>
    </div>
    <n-divider />
    <n-form :model="editForm" label-placement="top" class="space-y-4" @submit.prevent="onSave">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <n-form-item label="Имя" path="first_name">
          <n-input v-model:value="editForm.first_name" />
        </n-form-item>
        <n-form-item label="Фамилия" path="last_name">
          <n-input v-model:value="editForm.last_name" />
        </n-form-item>
        <n-form-item label="Отчество" path="middle_name">
          <n-input v-model:value="editForm.middle_name" />
        </n-form-item>
        <n-form-item label="Email" path="email">
          <n-input v-model:value="editForm.email" />
        </n-form-item>
        <n-form-item label="Город" path="city">
          <n-select v-model:value="editForm.city" :options="cityOptions" placeholder="Выберите город" filterable clearable />
        </n-form-item>
        <n-form-item label="Роль" path="roles">
          <n-select v-model:value="editForm.roles" :options="roleOptions" placeholder="Выберите роль" multiple filterable />
        </n-form-item>
        <n-form-item label="Сотрудник" path="is_staff">
          <n-switch v-model:value="editForm.is_staff" />
        </n-form-item>
        <n-form-item label="Активен" path="is_active">
          <n-switch v-model:value="editForm.is_active" />
        </n-form-item>
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <n-button :disabled="authStore.isLoading" :loading="authStore.isLoading" type="primary" @click="onSave">Сохранить</n-button>
        <n-button @click="logout" type="error">Выйти из аккаунта</n-button>
      </div>
    </n-form>
  </div>
</template>
<script lang="ts" setup>
import {onMounted, computed, ref} from "vue";
import {useAuthStore} from "@/stores/auth-store.ts";
import {NButton, NDivider, NForm, NFormItem, NInput, NSelect, NSwitch, useMessage} from 'naive-ui';
import {useRouter} from "vue-router";
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
const roleOptions = ref<{ label: string, value: any }[]>([]);


async function fetchCities() {
  const res = await axiosIns.get('/api/admin/handbook/city/');
  cityOptions.value = res.data.results.map((c: any) => ({ label: c.name, value: c.id }));
}

async function fetchRoles() {
  const res = await axiosIns.get('/api/users/roles/');
  roleOptions.value = res.data.map((r: any) => ({ label: r.name, value: r.id }));
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

onMounted(async ()=>{
  await authStore.userMe();
  await fetchCities();
  await fetchRoles();
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