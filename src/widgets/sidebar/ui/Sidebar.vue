<template>
    <div class="border-r h-[100vh] w-[250px] bg-white p-3 flex justify-between flex-col ">
        <div>
            <div class="flex items-center gap-3 cursor-pointer">
                <div class="flex gap-3 items-center">
                    <Avatar class="h-[40px]" :url="LogoAmazon"></Avatar>
                    <div class="text-2xl">Управление</div>
                </div>
                <XMarkIcon @click="appConfig.isOpenMenu = false" class="w-7 lg:hidden h-7 cursor-pointer"></XMarkIcon>
            </div>
            <div class="mt-5">
                <div v-for="option in filteredOptions">
                    <RouterLink :to="option.to" :class="{
                        'bg-orange-100 hover:bg-orange-200': checkRoute(option.to.name)
                    }" class="flex items-center gap-3 p-2 hover:bg-slate-100 font-medium cursor-pointer rounded-sm">
                        <component :is="option.icon" class="h-5 text-gray-500 w-5" />
                        <div>{{ option.label }}</div>
                    </RouterLink>
                </div>
            </div>
        </div>
        <div class="flex items-center hover:bg-slate-50 rounded-sm p-2 cursor-pointer gap-3">
            <Avatar class="w-8 rounded-full overflow-hidden h-8"
                url="https://avatars.steamstatic.com/beff5e1eec2b81ee51a99d3c01094e36f14ba605_full.jpg"></Avatar>
            <div>Дияр. Ш</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { CogIcon, ShoppingCartIcon, InboxIcon, UsersIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import Avatar from '@/shared/ui/Avatar.vue';
import { useRoute } from 'vue-router';
import { computed, ref, watch } from 'vue';
import appConfig from '@app/config/app';
import { useUserStore as useAuthStore } from '@entities/user';
import {LogoAmazon} from "@vicons/ionicons5";


const route = useRoute();

const activeItem = ref<any | null>(null);

watch(route, (newRoute) => {
    activeItem.value = newRoute.name;
});

function checkRoute(currentRoute: string) {
    const toCheckRouteNamePart = currentRoute.split('-')[0];
    return !!activeItem.value?.includes(toCheckRouteNamePart);

}

const options = ref([
    {
        label: "Запчасти",
        to: {
            name: 'parts-list'
        },
        icon: CogIcon,
        roles: ["admin", "manager", "warehouse"]
    },
    {
        label: "Заказы",
        to: {
            name: 'orders-list'
        },
        icon: ShoppingCartIcon,
        roles: ["admin", "manager"]
    },
    {
        label: "Склады",
        to: {
            name: 'warehouses-list'
        },
        icon: InboxIcon,
        roles: ["admin", "warehouse"]
    },
    {
        label: "Клиенты",
        to: {
            name: 'clients-list'
        },
        icon: UsersIcon,
        roles: ["all", "manager"]
    }
])

const authStore = useAuthStore();

const filteredOptions = computed(() => options.value.filter(option => authStore.hasAnyRole(option.roles)));
</script>