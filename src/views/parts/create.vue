<template>
  <main class="space-y-5 max-w-6xl mx-auto">
    <!-- Breadcrumbs -->
    <n-breadcrumb class="mb-2">
      <n-breadcrumb-item>
        <router-link to="/" class="text-slate-600 hover:text-slate-900 transition-colors">
          Главная
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        <router-link :to="{ name: 'parts-list' }" class="text-slate-600 hover:text-slate-900 transition-colors">
          Запчасти
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        <span class="text-slate-900 font-medium">Создание запчасти</span>
      </n-breadcrumb-item>
    </n-breadcrumb>

    <!-- Header Card -->
    <div class="rounded-3xl border border-slate-200/80 bg-white px-6 py-5 shadow-sm">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <!-- Левая часть: информация -->
        <div class="flex items-center gap-4">
          <div class="flex items-center justify-center w-16 h-16 rounded-lg bg-primary-100 text-primary-600">
            <n-icon :component="CogOutline" :size="32" />
          </div>
          <div>
            <div class="text-2xl font-semibold text-slate-900">Новая запчасть</div>
            <div class="text-sm text-slate-600">Шаг {{ current }} из 4</div>
          </div>
        </div>

        <!-- Правая часть: кнопка назад -->
        <n-button quaternary round @click="router.back()">
          Назад
        </n-button>
      </div>
    </div>

    <!-- Stepper Card -->
    <div class="rounded-3xl border border-slate-200/80 bg-white px-6 py-5 shadow-sm">
      <n-steps
        v-model:current="current"
        status="process"
        size="small"
      >
        <n-step
          :disabled="route.params.productId != null"
          title="Выбрать модель"
          description="Производитель автомобиля"
        />
        <n-step
          :disabled="route.params.productId != null"
          title="Модификация"
          description="Конкретная модель"
        />
        <n-step
          :disabled="route.params.productId != null"
          title="Информация"
          description="Детали запчасти"
        />
        <n-step
          title="Склад"
          description="Назначение склада"
        />
      </n-steps>
    </div>

    <!-- Content Card -->
    <section v-if="current">
      <n-card size="large">
        <div v-if="current == 1">
          <manufacturers @confirm="current = 2"></manufacturers>
        </div>
        <div v-if="current == 2">
          <modifications @confirm="current = 3"></modifications>
        </div>
        <div v-if="current == 3">
          <create-form></create-form>
        </div>
        <div v-if="current == 4">
          <assign-warehouse></assign-warehouse>
        </div>
      </n-card>
    </section>
  </main>
</template>

<script setup lang="ts">
import { NStep, NSteps, NCard, NBreadcrumb, NBreadcrumbItem, NButton, NIcon } from "naive-ui"
import { CogOutline } from '@vicons/ionicons5'
import { useRoute, useRouter } from "vue-router"
import { CreateForm, Manufacturers, Modifications, AssignWarehouse, current, setCurrent } from "./create-steps"
import { onMounted } from "vue"

const router = useRouter()
const route = useRoute()

onMounted(() => {
  setCurrent(1)
})
</script>
