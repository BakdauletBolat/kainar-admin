<template>
  <div class="profile-page">
    <n-page-header title="Профиль" @back="router.back()">
      <template #extra>
        <n-button @click="handleLogout">
          Выйти
        </n-button>
      </template>
    </n-page-header>

    <n-card class="profile-card">
      <n-descriptions label-placement="left" :column="1" bordered>
        <n-descriptions-item label="ID">
          {{ userStore.user?.id }}
        </n-descriptions-item>
        <n-descriptions-item label="Email">
          {{ userStore.user?.email }}
        </n-descriptions-item>
        <n-descriptions-item label="Имя">
          {{ userStore.user?.firstName }} {{ userStore.user?.lastName }}
        </n-descriptions-item>
        <n-descriptions-item label="Телефон">
          {{ userStore.user?.phone }}
        </n-descriptions-item>
        <n-descriptions-item label="Роли">
          <n-space>
            <n-tag v-for="role in userStore.user?.roles" :key="role.name" type="info">
              {{ role.name }}
            </n-tag>
          </n-space>
        </n-descriptions-item>
        <n-descriptions-item label="Статус">
          <n-tag :type="userStore.user?.isActive ? 'success' : 'error'">
            {{ userStore.user?.isActive ? 'Активен' : 'Неактивен' }}
          </n-tag>
        </n-descriptions-item>
      </n-descriptions>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NPageHeader, NCard, NDescriptions, NDescriptionsItem, NTag, NSpace, NButton } from 'naive-ui'
import { useRouter } from 'vue-router'
import { useUserStore } from '@entities/user'
import { useLogout } from '@features/auth/logout'

const router = useRouter()
const userStore = useUserStore()
const { logout } = useLogout()

function handleLogout() {
  logout()
}
</script>

<style scoped>
.profile-page {
  padding: 24px;
}

.profile-card {
  margin-top: 24px;
  max-width: 800px;
}
</style>
