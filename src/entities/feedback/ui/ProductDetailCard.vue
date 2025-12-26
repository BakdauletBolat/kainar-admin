<template>
  <n-card v-if="product" title="Информация о продукте" :bordered="true">
    <n-space vertical :size="16">
      <n-descriptions bordered :column="2">
        <n-descriptions-item label="ID">
          {{ product.id }}
        </n-descriptions-item>
        <n-descriptions-item label="Название">
          {{ product.name }}
        </n-descriptions-item>
        <n-descriptions-item label="Статус">
          <n-tag :type="getProductStatusType(product.status)">
            {{ getProductStatusText(product.status) }}
          </n-tag>
        </n-descriptions-item>
        <n-descriptions-item label="Цена">
          {{ product.market_price ? `${product.market_price.toLocaleString()} ₸` : 'Не указана' }}
        </n-descriptions-item>
        <n-descriptions-item label="Пробег" v-if="product.mileage">
          {{ product.mileage.toLocaleString() }} км
        </n-descriptions-item>
        <n-descriptions-item label="Категория">
          {{ product.category || 'Не указана' }}
        </n-descriptions-item>
        <n-descriptions-item label="Цвет">
          {{ product.color || 'Не указан' }}
        </n-descriptions-item>
        <n-descriptions-item label="Склад">
          {{ product.warehouse || 'Не указан' }}
        </n-descriptions-item>
      </n-descriptions>

      <n-descriptions v-if="product.properties || product.defect || product.comment" bordered :column="1">
        <n-descriptions-item v-if="product.properties" label="Свойства">
          {{ product.properties }}
        </n-descriptions-item>
        <n-descriptions-item v-if="product.defect" label="Дефекты">
          {{ product.defect }}
        </n-descriptions-item>
        <n-descriptions-item v-if="product.comment" label="Комментарий">
          {{ product.comment }}
        </n-descriptions-item>
      </n-descriptions>

      <div v-if="product.created_at || product.updated_at">
        <n-text depth="3">Даты</n-text>
        <n-descriptions bordered :column="2" class="mt-2">
          <n-descriptions-item v-if="product.created_at" label="Создано">
            {{ formatDate(product.created_at) }}
          </n-descriptions-item>
          <n-descriptions-item v-if="product.updated_at" label="Обновлено">
            {{ formatDate(product.updated_at) }}
          </n-descriptions-item>
        </n-descriptions>
      </div>
    </n-space>
  </n-card>
  <n-empty v-else description="Продукт не найден" />
</template>

<script setup lang="ts">
import { NCard, NDescriptions, NDescriptionsItem, NTag, NSpace, NText, NEmpty } from 'naive-ui';
import type { Product } from '../model/types';
import { ProductStatus as ProductStatusEnum } from '../model/types';

interface Props {
  product: Product | null;
}

defineProps<Props>();

function getProductStatusText(status: number): string {
  switch(status) {
    case ProductStatusEnum.RAW: return 'Черновик';
    case ProductStatusEnum.IN_STOCK: return 'В наличии';
    case ProductStatusEnum.RESERVED: return 'Зарезервирован';
    case ProductStatusEnum.DELETED: return 'Удален';
    case ProductStatusEnum.SOLD: return 'Продан';
    default: return 'Неизвестно';
  }
}

function getProductStatusType(status: number): 'default' | 'success' | 'warning' | 'error' | 'info' {
  switch(status) {
    case ProductStatusEnum.RAW: return 'default';
    case ProductStatusEnum.IN_STOCK: return 'success';
    case ProductStatusEnum.RESERVED: return 'warning';
    case ProductStatusEnum.DELETED: return 'error';
    case ProductStatusEnum.SOLD: return 'info';
    default: return 'default';
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>
