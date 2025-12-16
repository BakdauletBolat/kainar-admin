<template>
  <div class="part-detail-page">
    <n-page-header :title="`Запчасть #${partId}`" @back="router.back()">
      <template #extra>
        <n-space>
          <n-button @click="handleEdit">
            Редактировать
          </n-button>
          <n-button type="error" @click="handleDelete">
            Удалить
          </n-button>
        </n-space>
      </template>
    </n-page-header>

    <n-spin :show="partStore.isLoading">
      <n-card v-if="partStore.part" class="detail-card">
        <n-descriptions label-placement="left" :column="2" bordered>
          <n-descriptions-item label="Название">
            {{ partStore.part.name }}
          </n-descriptions-item>
          <n-descriptions-item label="Цена">
            {{ partStore.part.price }} ₸
          </n-descriptions-item>
          <n-descriptions-item label="Рыночная цена">
            {{ partStore.part.marketPrice }} ₸
          </n-descriptions-item>
          <n-descriptions-item label="Статус">
            <n-tag :type="getStatusType(partStore.part.status)">
              {{ getStatusLabel(partStore.part.status) }}
            </n-tag>
          </n-descriptions-item>
          <n-descriptions-item label="Склад">
            {{ partStore.part.warehouse.name }}
          </n-descriptions-item>
          <n-descriptions-item label="Категория">
            {{ partStore.part.category.name }}
          </n-descriptions-item>
          <n-descriptions-item label="Модель авто">
            {{ partStore.part.modelCar.name }}
          </n-descriptions-item>
          <n-descriptions-item label="Пробег">
            {{ partStore.part.mileage || '-' }}
          </n-descriptions-item>
        </n-descriptions>

        <n-divider />

        <h3>Изображения</h3>
        <n-space v-if="partStore.part.pictures.length">
          <n-image
            v-for="pic in partStore.part.pictures"
            :key="pic.id"
            :src="pic.image"
            width="200"
          />
        </n-space>
        <n-empty v-else description="Нет изображений" />
      </n-card>
    </n-spin>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { NPageHeader, NCard, NSpin, NDescriptions, NDescriptionsItem, NTag, NButton, NSpace, NDivider, NImage, NEmpty } from 'naive-ui'
import { useRouter, useRoute } from 'vue-router'
import { usePartStore } from '@entities/part'
import { useDeletePart } from '@features/part/delete-part'
import type { PartStatus } from '@entities/part'

const router = useRouter()
const route = useRoute()
const partStore = usePartStore()
const { deletePart } = useDeletePart()

const partId = computed(() => Number(route.params.id))

onMounted(() => {
  partStore.loadPart(partId.value)
})

function getStatusType(status: PartStatus): 'success' | 'warning' | 'error' | 'info' {
  const map: Record<PartStatus, 'success' | 'warning' | 'error' | 'info'> = {
    available: 'success',
    sold: 'info',
    reserved: 'warning',
    deleted: 'error',
    processing: 'warning'
  }
  return map[status] || 'default'
}

function getStatusLabel(status: PartStatus): string {
  const map: Record<PartStatus, string> = {
    available: 'Доступно',
    sold: 'Продано',
    reserved: 'Зарезервировано',
    deleted: 'Удалено',
    processing: 'В обработке'
  }
  return map[status] || status
}

function handleEdit() {
  router.push({ name: 'part-edit', params: { id: partId.value } })
}

async function handleDelete() {
  if (partStore.part) {
    const success = await deletePart(partId.value, partStore.part.name)
    if (success) {
      router.push({ name: 'parts-list' })
    }
  }
}
</script>

<style scoped>
.part-detail-page {
  padding: 24px;
}

.detail-card {
  margin-top: 24px;
  max-width: 1200px;
}
</style>
