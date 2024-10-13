<template>
    <div class="flex flex-col gap-6">
        <n-input @input="searchModifications" placeholder="Искать"></n-input>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SelectCard v-for="(item, index) in modificationStore.modifications" :key="index" :title="getTitle(item)"
                :logo="item.image" :id="item.id" :is-selected="item.id == manufacturerId" @select="onSelect(item.id)" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { onMounted } from 'vue';
import { SelectCard } from '@/views/parts/ui';
import { NInput } from 'naive-ui';
import { useRoute, useRouter } from 'vue-router';
import { useModificationsStore } from '@/stores/modifications-store';

const modificationStore = useModificationsStore();
const router = useRouter();
const route = useRoute();

const manufacturerId = ref<number>();

function searchModifications() {

}

function onSelect(v: number) { }

function getTitle(item: any) {
    return `${item.modelCar.name}, Тип кузова: ${item.bodyType}, Мощность: ${item.capacity}`
}

onMounted(() => {
    console.log("Mounted modifications")
    if (route.query.modificationId != undefined) {
        console.log(route.query);
    }
    if (route.query.modelCarId != undefined) {
        modificationStore.loadModifications(parseInt(route.query.modelCarId.toString()));
    }
})


</script>