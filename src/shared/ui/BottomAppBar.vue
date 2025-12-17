<template>
  <div class="fixed bottom-0 left-0 w-full bg-white shadow-md py-2">
    <div class="flex justify-around items-center">
      <n-button
        v-for="item in navItems"
        :key="item.label"
        quaternary
        @click="navigateTo(item.to)"
        class="flex flex-col items-center"
      >
        <n-icon size="24" :class="isActive(item) ? 'text-amber-500' : 'text-slate-600'">
          <component :is="item.icon" />
        </n-icon>
        <span :class="['text-xs', isActive(item) ? 'text-amber-600 font-semibold' : 'text-slate-600']">
          {{ item.label }}
        </span>
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import type { RouteLocationRaw } from 'vue-router';
import { useRoute, useRouter } from 'vue-router';
import { HomeIcon, ShoppingCartIcon, UserIcon } from '@heroicons/vue/24/outline';
import { NIcon, NButton } from 'naive-ui';

interface NavItem {
  label: string;
  icon: Component;
  to: RouteLocationRaw;
}

const router = useRouter();
const route = useRoute();

const navItems: NavItem[] = [
  { label: 'Главная', icon: HomeIcon, to: { name: 'main' } },
  { label: 'Заказы', icon: ShoppingCartIcon, to: { name: 'orders-list' } },
  { label: 'Профиль', icon: UserIcon, to: { name: 'profile' } },
];

const navigateTo = (target: RouteLocationRaw) => {
  router.push(target);
};

const isActive = (item: NavItem) => {
  if (typeof item.to === 'string') {
    return route.path === item.to;
  }
  return route.name === (item.to as any).name;
};


</script>

<style scoped>
.fixed {
    bottom: 0;
}
</style>
