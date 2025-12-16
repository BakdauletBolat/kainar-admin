<template>
  <div class="part-edit-page">
    <n-page-header title="Редактировать запчасть" @back="router.back()">
    </n-page-header>

    <n-card class="form-card">
      <EditPartForm
        :part-id="partId"
        @success="handleSuccess"
        @cancel="handleCancel"
      />
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NPageHeader, NCard } from 'naive-ui'
import { useRouter, useRoute } from 'vue-router'
import { EditPartForm } from '@features/part/edit-part'

const router = useRouter()
const route = useRoute()

const partId = computed(() => Number(route.params.id))

function handleSuccess() {
  router.push({ name: 'parts-list' })
}

function handleCancel() {
  router.back()
}
</script>

<style scoped>
.part-edit-page {
  padding: 24px;
}

.form-card {
  margin-top: 24px;
  max-width: 800px;
}
</style>
