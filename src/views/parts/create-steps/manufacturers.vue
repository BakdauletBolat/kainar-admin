<template>
    <div v-if="!manufacturerId" class="flex flex-col gap-6">
        <n-input @input="searchManufacturer" placeholder="Искать"></n-input>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SelectCard v-for="(item, index) in manufacturerStore.searchManufacturers" :key="index" :title="item.name"
                :logo="item.image" :id="item.id" :is-selected="item.id == manufacturerId" @select="onSelect(item.id)" />
        </div>
    </div>
    <div v-else-if="manufacturerId">
        <div class="flex justify-between items-center gap-6 mb-3">
            <div @click="clearManufacturers" class="text-orange-400 text-nowrap cursor-pointer block">К
                производителям</div>
            <n-input @input="searchModelCar" placeholder="Искать"></n-input>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SelectCard v-for="(item, index) in manufacturerStore.searchModelCars" :key="index" :title="item.name"
                :logo="item.image" :id="item.id" :is-selected="item.id == modelCarId"
                @select="onSelectModelCar(item.id)" @confirm="confirmModelCar" />
        </div>
    </div>

</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useManufacturerStore } from '@/stores/manufacturer-store';
import { onMounted } from 'vue';
import { SelectCard } from '@/views/parts/ui';
import { NInput } from 'naive-ui';
import { useRoute, useRouter } from 'vue-router';
import {setCurrent} from "@/views/parts/create-steps/index.ts";

const manufacturerStore = useManufacturerStore();
const emit = defineEmits(['confirm']);
const router = useRouter();
const route = useRoute();

const manufacturerId = ref<number>();
const modelCarId = ref<number>();

function onSelect(id: number) {
    manufacturerId.value = id;
    manufacturerStore.loadModelCars(manufacturerId.value).then(res => {
        manufacturerStore.searchModelCars = res;
    });
    router.push({ query: { ...route.query, manufacturerId: id } })
}

function onSelectModelCar(id: number) {
    modelCarId.value = id;
    router.push({ query: { ...route.query, modelCarId: id } })
    setCurrent(1)
}

function clearManufacturers() {
    manufacturerId.value = undefined;
    modelCarId.value = undefined;
    router.push({ query: {} })
}

function searchManufacturer(value: string) {
    if (value == '' || value == undefined) {
        manufacturerStore.searchManufacturers = manufacturerStore.manufacturers;
        return;
    }
    const searched = manufacturerStore.manufacturers.filter((item) => item.name.toLowerCase().startsWith(value.toLowerCase()));
    manufacturerStore.searchManufacturers = searched;
}

function searchModelCar(value: string) {
    if (value == '' || value == undefined) {
        manufacturerStore.searchModelCars = manufacturerStore.modelCars;
        return;
    }
    const searched = manufacturerStore.modelCars.filter((item) => item.name.toLowerCase().startsWith(value.toLowerCase()));
    manufacturerStore.searchModelCars = searched;
}

function confirmModelCar() {
    router.push({ query: { ...route.query} })
    setCurrent(2)
    emit('confirm')
}
onMounted(() => {
    if (route.query.manufacturerId != null) {
        manufacturerId.value = parseInt(route.query.manufacturerId.toString());
        manufacturerStore.loadModelCars(manufacturerId.value).then(res => {
            manufacturerStore.searchModelCars = res;
        });
    }
    if (route.query.modelCarId != null) {
        modelCarId.value = parseInt(route.query.modelCarId.toString());
    }

    if (route.query.productId != null) {
      setCurrent(4)
    }

    manufacturerStore.loadManufacturers().then(manufacturers => {
        manufacturerStore.searchManufacturers = manufacturers;
    });
})


</script>