<template>
  <n-page-header @back="handleBack" class="mb-4">
    <template #title>
      Создание
    </template>
  </n-page-header>
  <main v-if="current">
    <n-steps v-model:current="current" status="process">
      <n-step title="Выбрать модель" />
      <n-step title="Выберите модификацию" />
      <n-step title="Форма" />
      <n-step title="Склад" />
    </n-steps>
    <section>
      <n-card class="mt-5">
        <div v-if="current == 1">
          <Manufacturers @confirm="current = 2"></Manufacturers>
        </div>
        <div v-if="current == 2">
          <Modifications></Modifications>
        </div>
        <div v-if="current == 3">
          <create-form></create-form>
        </div>
      </n-card>
    </section>
  </main>
</template>
<script setup lang="ts">
import { NPageHeader, NStep, NSteps, NCard } from "naive-ui";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { CreateForm, Manufacturers, Modifications } from "./create-steps";
const router = useRouter();
const route = useRoute();
const current = ref<number | null>(null);

function handleBack() {
  router.back();
}


onMounted(() => {
  console.log("Mounted create", route.query)
  if (route.query.step != undefined) {
    current.value = parseInt(route.query.step.toString());
  }
  else {
    current.value = 1;
  }
})

</script>