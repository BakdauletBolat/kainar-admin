<template>
    <div class="flex flex-col gap-6">
<!--        <n-input @input="searchModifications" placeholder="Искать"></n-input>-->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SelectCard 
                v-for="(item, index) in modificationStore.modifications" 
                :key="index" :title="getTitle(item)"
                :logo="item.image" 
                :id="item.id" 
                :is-selected="item.id == modificationId" 
                @confirm="onConfirm" 
                @select="onSelect(item.id)" 
            />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { onMounted } from 'vue';
import { SelectCard } from '@/views/parts/ui';
import { useRoute, useRouter } from 'vue-router';
import { useModificationsStore } from '@/stores/modifications-store';
import {setCurrent} from "@/views/parts/create-steps/index.ts";

const modificationStore = useModificationsStore();
const router = useRouter();
const route = useRoute();
const emit = defineEmits(['confirm'])
const modificationId = ref();


function onSelect(value: number) {
  modificationId.value = value;
  router.push({query: {...route.query, modificationId: modificationId.value }})
}

function onConfirm(id: number) {
  router.push({query: {...route.query }})
  setCurrent(3);
  emit('confirm', id);
}

function getTitle(item: any) {
    console.log("getTitle", item)
    return `${item.modelCar.name}, ${item.bodyType}, ${item.capacity}лс, ${item.modelCar.startDate}`;
}

onMounted(() => {
    console.log("Mounted modifications")
    if (route.query.modificationId != null) {
        modificationId.value = parseInt(route.query.modificationId.toString());
    }
    if (route.query.modelCarId != null) {
        modificationStore.loadModifications(parseInt(route.query.modelCarId.toString()));
    }
    if (route.query.productId != null) {
      setCurrent(4)
    }
})


</script>