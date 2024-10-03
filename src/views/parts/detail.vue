<template>
    <main>
        <n-page-header class="mb-4" @back="handleBack">
            <template #title>
                {{product?.name}}
            </template>
          <template #subtitle>
            {{product?.warehouse.name}} / {{product?.warehouse.city.name}}
          </template>
        </n-page-header>
        <div v-if="isLoading" class="grid grid-cols-3 gap-2">
            <NSkeleton height="400px" width="100%" :sharp="false"></NSkeleton>
            <NSkeleton height="400px" width="100%" :sharp="false"></NSkeleton>
            <NSkeleton height="400px" width="100%" :sharp="false"></NSkeleton>
        </div>
        <div v-else class="grid grid-cols-3 gap-2">
            <NCard>
                <n-descriptions :column="2" label-placement="top" title="Параметры детали">
                    <n-descriptions-item label="Статус">
                        <NTag type="success">
                            {{product?.status}}
                        </NTag>
                    </n-descriptions-item>
                    <n-descriptions-item label="ID">
                        #{{product?.id}}
                    </n-descriptions-item>
                    <n-descriptions-item label="ОЕМ коды">
                        {{product?.code.join(', ') ? product?.code : '-'}}
                    </n-descriptions-item>
                    <n-descriptions-item label="Цветовой код">
                        -
                    </n-descriptions-item>
                    <n-descriptions-item label="Цена">
                        {{product?.price}}
                    </n-descriptions-item>
                    <n-descriptions-item label="Состояние">
                        {{product?.defect ? product?.defect : '-' }} 
                    </n-descriptions-item>
                    <n-descriptions-item label="Место нахождения">
                        {{product?.warehouse.name}}
                    </n-descriptions-item>
                    <n-descriptions-item label="Комментарий">
                        {{product?.comment ? product?.comment : '-'}}
                    </n-descriptions-item>
                    <n-descriptions-item label="Дата загрузки">
                        <!-- {{ product?.created_at }} -->
                        {{formatDate(product?.created_at)}}
                    </n-descriptions-item>
                </n-descriptions>
            </NCard>
            <NCard>
                    <Slider v-if="product?.pictures" :pictures="product?.pictures"/>
            </NCard>
            <NCard>
                 <n-descriptions label-placement="top" title="Технические характеристики автомобиля">
                    <n-descriptions-item>
                        <template #label>
                            Breakfast
                        </template>
                        Apple
                    </n-descriptions-item>
                    <n-descriptions-item label="Brunch">
                        Apple
                    </n-descriptions-item>
                    <n-descriptions-item label="Lunch">
                        Apple
                    </n-descriptions-item>
                    <n-descriptions-item label="Supper" :span="2">
                        Two<br>
                        Apples
                    </n-descriptions-item>
                    <n-descriptions-item label="Midnight Snack">
                        Apple
                    </n-descriptions-item>
                </n-descriptions>
            </NCard>
        </div>
    </main>
</template>
<script setup lang="ts">
import { NPageHeader, NCard, NDescriptions, NDescriptionsItem, NTag, NSkeleton } from 'naive-ui';
import axiosIns from '@/apis';
import { useRouter, useRoute } from 'vue-router';
import { IProduct } from '@/stores/models';
import Slider from '@/components/Slider.vue';
import {formatDate} from '@/utils/formatDate';
import { ref, onMounted } from 'vue';


const router = useRouter();
const route = useRoute();
const product = ref<IProduct | null>(null);
const isLoading = ref<boolean>(false);

onMounted(() => {
    const productId = route.params.id.toString();
    isLoading.value = true;
    axiosIns.get<IProduct>(`/api/product/${productId}/`).then(res => {
        product.value = res.data;
    }).finally(()=>{
        isLoading.value = false;
    })
})


function handleBack() {
    router.back();
}
</script>
<style>
    @import url("node_modules/@egjs/vue3-flicking/dist/flicking.css");
</style>