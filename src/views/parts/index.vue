<template>
    <main class="grid">
        <TopHeader title="Запчасти">
            <template #actions>
                <RouterLink :to="{
                    name: 'parts-create'
                }" class="bg-orange-400 block text-center px-3 py-1.5 rounded-sm text-white">Создать</RouterLink>
            </template>
        </TopHeader>

       <div class="w-full rounded-sm shadow-sm relative overflow-scroll border">
        <table class="table ">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Склад</th>
                    <th>Цена</th>
                    <th>Комментарий</th>
                    <th>Статус</th>
                    <th>Действие</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in items">
                    <td class="font-bold">{{ item.id }}</td>
                    <td>
                        <div class="gap-3 grid lg:grid-cols-[100px_1fr]">
                            <Avatar class="h-[100px] w-[100px] border rounded-sm" :url="item.pictures.length > 0
                                    ? item.pictures[0].image
                                    : 'https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ='
                                " />
                            <div>
                                <div class="text-orange-500 text-lg">
                                    {{ item.name }}
                                </div>
                                <div class="text-gray-500  font-light">
                                    <div>
                                        {{ item.modification.modelCar?.name }}
                                        {{ item.modification.modelCar?.startDate }}
                                    </div>
                                    <div class="text-xs">
                                        2001 АКПП LHD
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>{{ item.warehouse ?? '-' }}</td>
                    <td>{{ item.price }}</td>
                    <td>{{ item.comment ?? '-' }}</td>
                    <td>{{ item.status }}</td>
                    <td>
                        <div class="flex">
                            <RouterLink :to="{
                            name: 'warehouses-edit',
                            params: {
                                id: item.id
                            }
                        }">
                            <PencilSquareIcon class="w-7 h-7 text-gray-700"></PencilSquareIcon>
                        </RouterLink>

                        <TrashIcon class="w-7 h-7 text-gray-700"></TrashIcon>
                        </div>

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
import Avatar from '@/components/Avatar.vue';

const items = ref<any[]>([]);
const isLoading = ref(false);

const getProducts = () => {
    isLoading.value = true;
    axios.get("/api/product/").then((response) => {
        items.value = response.data.results;
    }).finally(() => {
        isLoading.value = false;
    });
}

onMounted(() => {
    getProducts();
});

</script>