<template>
    <main class="w-full grid">
        <TopHeader title="Склады">
            <template #actions>
                <RouterLink :to="{
                    name: 'warehouses-create'
                }" class="bg-orange-400 block text-center px-3 py-1.5 rounded-sm text-white">Создать</RouterLink>
            </template>
        </TopHeader>
    <div class="grid">
        <table class="table rounded-sm">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Действие</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in items">
                    <td>{{ item.id }}</td>
                    <td>{{ item.name }}</td>
                    <td class="flex">
                        <RouterLink :to="{
                            name: 'warehouses-edit',
                            params: {
                                id: item.id
                            }
                        }">
                        <PencilSquareIcon class="w-7 h-7 text-gray-700"></PencilSquareIcon>
                        </RouterLink>
                       
                        <TrashIcon class="w-7 h-7 text-gray-700"></TrashIcon>
        
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    </main>
</template>
<script setup lang="ts">
import TopHeader from '@/components/TopHeader.vue';
import { onMounted, ref } from 'vue';
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline';
import axios from '@/apis/index.ts';

const items = ref<any[]>([]);
const isLoading = ref(false);

const getWarehouses = () => {
    isLoading.value = true;
    axios.get("/api/stock/warehouses/").then((response) => {
        console.log(response)
        items.value = response.data.results;
    }).finally(() => {
        isLoading.value = false;
    });
}

onMounted(() => {
    getWarehouses();
});

</script>