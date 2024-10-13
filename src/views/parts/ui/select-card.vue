<template>
    <n-card class="cursor-pointer relative bg-gray-50 p-4 border border-transparent shadow-sm rounded-md" :class="{
        '!border-yellow-400': isSelected
    }" :hoverable="true" @click="toggleSelection">
        <div class="flex items-center gap-4">
            <img v-if="logo" :src="logo" alt="logo" class="w-12 h-12 object-cover rounded-full" />
            <span class="text-lg">{{ title }}</span>
        </div>
        <div>
            <SlideLeaveAnimated class="absolute z-10 bottom-5 right-5" :is-visible="isSelected">
                <n-button @click="emit('confirm')" type="primary">Продолжить</n-button>
            </SlideLeaveAnimated>
        </div>
    </n-card>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import { NButton, NCard } from 'naive-ui';
import SlideLeaveAnimated from '@/components/SlideLeaveAnimated.vue';
interface CardProps {
    title: string;
    id: number;
    isSelected: boolean;
    logo?: string | null;
}

const props = defineProps<CardProps>();

const emit = defineEmits(['select', 'confirm']);

function toggleSelection() {
    emit('select', props.id);
}
</script>

<style scoped>
/* Дополнительная стилизация, если потребуется */
</style>