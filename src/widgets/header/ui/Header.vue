<template>
  <n-layout-header bordered class="header">
    <n-space align="center" justify="space-between" style="height: 100%">
      <n-space align="center">
        <n-button text @click="emit('toggle-sidebar')">
          <n-icon size="24">
            <MenuOutline />
          </n-icon>
        </n-button>
        <n-text strong style="font-size: 18px">Kainar Admin</n-text>
      </n-space>

      <n-space align="center">
        <n-text>{{ userStore.user?.name }}</n-text>
        <n-dropdown :options="userMenuOptions" @select="handleUserMenuSelect">
          <n-button circle>
            <n-icon>
              <PersonOutline />
            </n-icon>
          </n-button>
        </n-dropdown>
      </n-space>
    </n-space>
  </n-layout-header>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { NLayoutHeader, NSpace, NButton, NIcon, NText, NDropdown } from 'naive-ui'
import { MenuOutline, PersonOutline, LogOutOutline } from '@vicons/ionicons5'
import { useUserStore } from '@entities/user'
import { useLogout } from '@features/auth/logout'

const emit = defineEmits<{
  'toggle-sidebar': []
}>()

const userStore = useUserStore()
const { logout } = useLogout()

const userMenuOptions = [
  {
    label: 'Выход',
    key: 'logout',
    icon: () => h(NIcon, null, { default: () => h(LogOutOutline) })
  }
]

function handleUserMenuSelect(key: string) {
  if (key === 'logout') {
    logout()
  }
}
</script>

<style scoped>
.header {
  padding: 0 24px;
  height: 64px;
}
</style>
