<template>
<div class="w-full z-10 p-3 border-b border-white/60 bg-white/80 backdrop-blur-xl shadow-sm">
    <div class="flex max-w-6xl mx-auto justify-between">
        <div class="flex items-center gap-3">
        <Bars3Icon @click="appConfig.isOpenMenu = true;" class="w-7 lg:hidden h-7 cursor-pointer"></Bars3Icon>
        <RouterLink v-if="backRoute" :to="backRoute">
        <ChevronLeftIcon class="w-7 h-7"></ChevronLeftIcon>
            </RouterLink>
        <h1 class="text-2xl font-light text-gray-900">{{ title }}</h1>
    </div>
    <div class="actions flex items-center gap-3">
        <slot name="actions"></slot>
    </div>
    </div>
</div>
</template>
<script lang="ts" setup>
import { ChevronLeftIcon, Bars3Icon } from '@heroicons/vue/24/outline';
import appConfig from '@/stores/app.ts'; 
defineProps<{
    title: string,
    backRoute?: {
        name: string
    }
}>()
</script>
