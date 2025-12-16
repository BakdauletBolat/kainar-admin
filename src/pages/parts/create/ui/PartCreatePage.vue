<template>
  <div class="part-create-page">
    <n-page-header title="Создать запчасть" @back="router.back()">
    </n-page-header>

    <n-card class="form-card">
      <CreatePartForm @success="handleSuccess" @cancel="handleCancel" />
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NPageHeader, NCard } from 'naive-ui'
import { useRouter } from 'vue-router'
import { CreatePartForm } from '@features/part/create-part'

const router = useRouter()

function handleSuccess() {
  router.push({ name: 'parts-list' })
}

function handleCancel() {
  router.back()
}
</script>

<style scoped>
.part-create-page {
  padding: 24px;
}

.form-card {
  margin-top: 24px;
  max-width: 800px;
}
</style>
