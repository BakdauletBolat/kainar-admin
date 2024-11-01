<template>
  <n-page-header @back="handleBack" class="mb-4">
    <template #title>
      Создание
    </template>
  </n-page-header>
  <main v-if="current">
    <n-steps v-model:current="current" status="process">
      <n-step :disabled="route.params.productId != null" title="Выбрать модель" />
      <n-step :disabled="route.params.productId != null" title="Выберите модификацию" />
      <n-step :disabled="route.params.productId != null" title="Форма" />
      <n-step title="Склад" />
    </n-steps>
    <section>
      <n-card class="mt-5">
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
import { NPageHeader, NStep, NSteps, NCard } from "naive-ui";
import {useRoute, useRouter} from "vue-router";
import {CreateForm, Manufacturers, Modifications, AssignWarehouse, current, setCurrent} from "./create-steps";
import {onMounted} from "vue";
const router = useRouter();
const route = useRoute();


function handleBack() {
  router.back();
}

onMounted(()=>{
  setCurrent(1)
})



</script>