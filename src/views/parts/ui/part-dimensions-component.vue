<template>
    <div v-if="detail">
        <n-descriptions :column="2" label-placement="top" title="Размеры детали">
            <n-descriptions-item label="Высота">
                {{ detail.height }} cm
            </n-descriptions-item>
            <n-descriptions-item label="Длина">
                {{ detail.length }} cm
            </n-descriptions-item>
            <n-descriptions-item label="Вес">
                {{ detail.weight }} kg
            </n-descriptions-item>
            <n-descriptions-item label="Ширина">
                {{ detail.width }} cm
            </n-descriptions-item>
        </n-descriptions>
    </div>
    <div v-else>
        <n-button>Создать размеры деталей</n-button>
    </div>
</template>
<script lang="ts" setup>
import { NButton, NDescriptionsItem, NDescriptions } from 'naive-ui';
defineProps(['detail']);
</script>