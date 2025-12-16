<template>
  <div class="client-detail-page">
    <n-page-header @back="handleBack">
      <template #title>
        Клиент #{{ clientId }}
      </template>
      <template #subtitle v-if="clientStore.client">
        {{ clientStore.client.firstName }} {{ clientStore.client.lastName }}
      </template>
    </n-page-header>

    <div class="content">
      <n-card v-if="clientStore.isLoading">
        <n-skeleton :repeat="5" />
      </n-card>

      <n-card v-else-if="clientStore.client">
        <EditClientForm
          :client-id="clientId"
          @success="handleSuccess"
          @cancel="handleBack"
        />
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NPageHeader, NCard, NSkeleton, useMessage } from 'naive-ui'
import { EditClientForm } from '@features/client/edit-client'
import { useClientStore } from '@entities/client'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const clientStore = useClientStore()

const clientId = computed(() => Number(route.params.id))

onMounted(() => {
  clientStore.loadClient(clientId.value)
})

function handleBack() {
  router.back()
}

function handleSuccess() {
  message.success('Клиент успешно обновлен')
  clientStore.loadClient(clientId.value)
}
</script>

<style scoped>
.client-detail-page {
  padding: 16px;
}

.content {
  max-width: 800px;
  margin: 24px auto 0;
}
</style>
