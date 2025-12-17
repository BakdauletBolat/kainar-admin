<template>
  <main class="space-y-5 max-w-4xl">
    <n-breadcrumb class="mb-2">
      <n-breadcrumb-item>
        <router-link to="/" class="text-slate-600 hover:text-slate-900 transition-colors">
          Главная
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        <router-link :to="{ name: 'orders-list' }" class="text-slate-600 hover:text-slate-900 transition-colors">
          Заказы
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        <span class="text-slate-900 font-medium">Изменить заказ</span>
      </n-breadcrumb-item>
    </n-breadcrumb>

    <div class="rounded-3xl border border-slate-200/80 bg-white px-6 py-5 shadow-sm">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div class="text-2xl font-semibold text-slate-900">Изменение заказа</div>
          <div class="text-sm text-slate-600">Здесь появится форма редактирования заказа</div>
        </div>
        <n-button quaternary round @click="router.back()">Назад</n-button>
      </div>
    </div>

    <n-card size="large">
      <p class="text-sm text-slate-600">
        Форма редактирования находится в разработке. Сообщите, какие поля нужно изменить, и мы добавим обновление.
      </p>
      <div class="mt-4 flex flex-wrap gap-3">
        <n-button round quaternary @click="router.back()">Вернуться</n-button>
        <n-button type="primary" round @click="router.push({ name: 'orders-list' })">
          К списку заказов
        </n-button>
      </div>
    </n-card>
  </main>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { NBreadcrumb, NBreadcrumbItem, NButton, NCard } from 'naive-ui';

const router = useRouter();
</script>
