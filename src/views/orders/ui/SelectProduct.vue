<template>
    <div class="p-4">
        <n-button @click="showModal = true">Выбрать товары</n-button>

        <!-- Модальное окно -->
        <n-modal v-model:show="showModal" title="Выберите товары" class="w-[50%] overflow-y-scroll h-[80vh]" closable>
            <div class="p-4 bg-white rounded space-y-4">
                <!-- Поле для поиска -->
                <n-input v-model:value="searchQuery" placeholder="Поиск товаров..." clearable
                    @input="debouncedLoadProducts" />


                <n-button block type="primary" @click="closeModal">Подтвердить выбор</n-button>

                <div v-if="productStore.isLoadingProducts" class="flex justify-center items-center h-64">
                    <n-spin size="large" />
                </div>
                <!-- Список товаров в виде карточек -->
                <div v-if="productStore.products.length > 0"
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div v-for="product in productStore.products" :key="product.id"
                        @click="() => emit('selected', product)"
                        :class="['p-4 bg-white border-2 border-white rounded-lg cursor-pointer hover:shadow-xl transition-all', { 'border-2 !border-orange-400': isSelected(product) }]">
                        <img :src="product.pictures[0].image" v-if="product.pictures.length > 0" alt="product image"
                            class="w-full h-32 object-cover rounded-md" />
                        <div class="mt-4">
                            <div class="font-bold text-lg">{{ product.name }}</div>
                            <div class="text-gray-500 text-sm">{{ product.status }}</div>
                        </div>
                    </div>
                </div>

                <div v-else>
                    Такого товара нету
                </div>
            </div>
        </n-modal>

        <!-- Список выбранных товаров -->
        <div v-if="selectedProducts.length" class="mt-8 space-y-4">
            <h2 class="text-2xl font-bold">Выбранные товары</h2>
            <div v-for="product in selectedProducts" :key="product.id" class="p-4 bg-white rounded flex">
                <img :src="product.pictures[0].image" alt="product image" class="w-24 h-24 object-cover rounded-md" />
                <div class="ml-4">
                    <div class="font-bold text-lg">{{ product.name }}</div>
                    <div class="text-gray-500">{{ product.status }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { NButton, NModal, NInput, NSpin } from 'naive-ui'
import { useProductStore } from '@/stores/product-store';
import { ProductList } from "@/apis/orders.ts";
import { useDebounceFn } from '@vueuse/core';


const productStore = useProductStore();
const props = defineProps(['selectedProducts']);
const emit = defineEmits(['selected'])



const showModal = ref(false)
const searchQuery = ref('')



// Проверка, выбран ли товар
function isSelected(product: ProductList): boolean {
    return props.selectedProducts.some((p: any) => p.id === product.id)
}




function closeModal() {
    showModal.value = false
}


const debouncedLoadProducts = useDebounceFn((value: string) => {
    productStore.loadProducts({
        page: 1,
        search: value,
        page_size: 10,
        status: 3
    });
}, 500);


onMounted(() => {
    productStore.loadProducts({ page: 1, page_size: 3, status: "5" })
})

</script>

<style scoped>
/* Дополнительные стили, если нужно */
</style>