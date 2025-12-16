<template>
  <div class="client-create-page">
    <n-page-header @back="handleBack">
      <template #title>Новый клиент</template>
    </n-page-header>

    <div class="content">
      <n-card>
        <CreateClientForm
          @success="handleSuccess"
          @cancel="handleBack"
        />
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { NPageHeader, NCard, useMessage } from 'naive-ui'
import { CreateClientForm } from '@features/client/create-client'

const router = useRouter()
const message = useMessage()

function handleBack() {
  router.back()
}

function handleSuccess() {
  message.success('Клиент успешно создан')
  router.push({ name: 'clients-list' })
}
</script>

<style scoped>
.client-create-page {
  padding: 16px;
}

.content {
  max-width: 800px;
  margin: 24px auto 0;
}
</style>
