<template>
    <div class="fixed bottom-0 left-0 w-full bg-white shadow-md py-2">
        <div class="flex justify-around items-center">
            <n-button quaternary @click="navigateTo('/')" class="flex flex-col items-center">
                <n-icon size="24">
                    <CogIcon />
                </n-icon>
                <span class="text-xs">Главная</span>
            </n-button>
            <n-button quaternary @click="navigateTo('/')" class="flex flex-col items-center">
                <n-icon size="24">
                    <ShoppingCartIcon />
                </n-icon>
                <span class="text-xs">Профиль</span>
            </n-button>
            <n-button quaternary @click="navigateTo('/')" class="flex flex-col items-center">
                <n-icon size="24">
                    <InboxIcon />
                </n-icon>
                <span class="text-xs">Настройки</span>
            </n-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { CogIcon, ShoppingCartIcon, InboxIcon } from '@heroicons/vue/24/outline';
import { NIcon, NButton } from 'naive-ui';

const router = useRouter()

const navigateTo = (route: any) => {
    router.push(route)
}


</script>

<style scoped>
.fixed {
    bottom: 0;
}
</style>