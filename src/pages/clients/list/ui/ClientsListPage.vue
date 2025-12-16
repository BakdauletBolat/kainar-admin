<template>
  <div class="clients-list-page">
    <n-page-header title="Клиенты">
      <template #subtitle>
        {{ clientStore.totalCount }}
      </template>
      <template #extra>
        <n-space>
          <n-input
            v-model:value="searchPhone"
            placeholder="Поиск по номеру телефона"
            clearable
            style="width: 300px"
            @update:value="handleSearch"
          />
          <n-button type="primary" @click="handleCreate">
            <template #icon>
              <n-icon><AddOutline /></n-icon>
            </template>
            Создать клиента
          </n-button>
        </n-space>
      </template>
    </n-page-header>

    <div class="content">
      <ClientsList @create="handleCreate" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NPageHeader, NSpace, NButton, NIcon, NInput } from 'naive-ui'
import { AddOutline } from '@vicons/ionicons5'
import { ClientsList } from '@widgets/clients-list'
import { useClientStore } from '@entities/client'

const router = useRouter()
const clientStore = useClientStore()

const searchPhone = ref('')

onMounted(() => {
  clientStore.loadClients()
})

function handleSearch() {
  clientStore.loadClients({ search: searchPhone.value })
}

function handleCreate() {
  router.push({ name: 'clients-create' })
}
</script>

<style scoped>
.clients-list-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  margin-top: 16px;
}
</style>
