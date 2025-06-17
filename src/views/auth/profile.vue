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
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div class="text-gray-500 text-sm">Телефон</div>
        <div class="font-medium">{{ authStore.user?.phone || '—' }}</div>
      </div>
      <div>
        <div class="text-gray-500 text-sm">Email</div>
        <div class="font-medium">{{ authStore.user?.email || '—' }}</div>
      </div>
      <div>
        <div class="text-gray-500 text-sm">Город</div>
        <div class="font-medium">{{ authStore.user?.city?.name || '—' }}</div>
      </div>
      <div>
        <div class="text-gray-500 text-sm">UUID</div>
        <div class="font-mono text-xs break-all">{{ authStore.user?.uuid }}</div>
      </div>
      <div>
        <div class="text-gray-500 text-sm">Дата регистрации</div>
        <div class="font-medium">{{ formatDate(authStore.user?.date_joined) }}</div>
      </div>
      <div>
        <div class="text-gray-500 text-sm">Последний вход</div>
        <div class="font-medium">{{ formatDate(authStore.user?.last_login) }}</div>
      </div>
      <div>
        <div class="text-gray-500 text-sm">Статус</div>
        <n-tag :type="authStore.user?.is_active ? 'success' : 'error'">
          {{ authStore.user?.is_active ? 'Активен' : 'Неактивен' }}
        </n-tag>
      </div>
      <div>
        <div class="text-gray-500 text-sm">Права</div>
        <div class="flex flex-wrap gap-2 mt-1">
          <n-tag v-if="authStore.user?.is_superuser" type="info" size="small">Суперпользователь</n-tag>
          <n-tag v-if="authStore.user?.is_staff" type="warning" size="small">Сотрудник</n-tag>
        </div>
      </div>
    </div>
    <div class="flex justify-end mt-4">
      <n-button @click="logout" type="error" size="large">Выйти из аккаунта</n-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {onMounted, computed} from "vue";
import {useAuthStore} from "@/stores/auth-store.ts";
import {NButton, NTag, NDivider} from 'naive-ui';
import {useRouter} from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

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

function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleString('ru-RU', { dateStyle: 'medium', timeStyle: 'short' });
}

async function logout() {
  await authStore.logout();
  await router.push("/login");
}

onMounted(()=>{
  authStore.userMe();
})
</script>