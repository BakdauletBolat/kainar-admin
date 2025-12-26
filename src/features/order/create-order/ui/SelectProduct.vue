<template>
  <div class="space-y-4">
    <n-button type="primary" round size="large" class="font-medium" @click="showModal = true">
      Выбрать товары
    </n-button>

    <div v-if="selectedProducts.length" class="space-y-3">
      <h3 class="text-sm font-semibold text-slate-900">Выбранные товары</h3>
      <div class="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white">
        <div
          v-for="product in selectedProducts"
          :key="product.id"
          class="flex items-center gap-3 px-3 py-2"
        >
          <div
            class="overflow-hidden rounded-lg bg-slate-50 ring-1 ring-slate-200/60"
            style="width: 56px; height: 56px; min-width: 56px; min-height: 56px"
          >
            <img
              v-if="product.pictures?.[0]?.image"
              :src="product.pictures[0].image"
              alt="product image"
              class="h-full w-full object-cover"
            />
            <div v-else class="flex h-full w-full items-center justify-center text-slate-300">
              <n-icon :component="ImageOutline" :size="18" />
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-slate-900 truncate">{{ product.name }}</p>
            <p class="text-xs text-slate-500">ID {{ product.id }}</p>
          </div>
          <tenge-amount :value="product.price" />
        </div>
      </div>
    </div>

    <n-modal v-model:show="showModal" transform-origin="center">
      <n-card style="width: 960px" size="huge" :bordered="false" role="dialog" aria-modal="true">
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xl font-semibold text-slate-900">Выберите товары</p>
              <p class="text-sm text-slate-600">Используйте поиск для быстрого выбора позиции</p>
            </div>
            <n-button quaternary round size="medium" @click="closeModal">Закрыть</n-button>
          </div>
        </template>

        <div class="space-y-4">
          <n-input
            v-model:value="searchQuery"
            placeholder="Поиск товаров..."
            clearable
            size="large"
            @input="debouncedLoadProducts"
          />

          <div v-if="productStore.isLoadingProducts" class="flex justify-center py-16">
            <n-spin size="large" />
          </div>
          <div
            v-else-if="productStore.products.length > 0"
            class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <div
              v-for="product in productStore.products"
              :key="product.id"
              :class="[
                'flex cursor-pointer flex-col gap-2 rounded-2xl border px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
                isSelected(product) ? 'border-amber-400 ring-2 ring-amber-100' : 'border-slate-200/80'
              ]"
              @click="() => emit('selected', product)"
            >
              <div class="h-32 overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-200/60">
                <img
                  v-if="product.pictures?.[0]?.image"
                  :src="product.pictures[0].image"
                  alt="product image"
                  class="h-full w-full object-cover"
                />
                <div v-else class="flex h-full items-center justify-center text-slate-300">
                  <n-icon :component="ImageOutline" :size="24" />
                </div>
              </div>
              <div class="flex min-h-[72px] flex-col gap-1">
                <p class="text-sm font-semibold text-slate-900 line-clamp-2">{{ product.name }}</p>
                <p class="text-xs text-slate-500">ID {{ product.id }}</p>
              </div>
              <div class="flex items-center justify-between">
                <tenge-amount :value="product.price" />
                <n-tag v-if="isSelected(product)" size="small" round :bordered="false" type="success">
                  Выбран
                </n-tag>
              </div>
            </div>
          </div>
          <div v-else class="py-8 text-center text-sm text-slate-500">
            Такого товара нету
          </div>

          <div class="flex justify-end gap-2 border-t border-slate-100 pt-3">
            <n-button quaternary round @click="closeModal">Отмена</n-button>
            <n-button type="primary" round @click="closeModal">Подтвердить выбор</n-button>
          </div>
        </div>
      </n-card>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { NButton, NModal, NInput, NSpin, NCard, NIcon, NTag } from 'naive-ui';
import { usePartStore as useProductStore, ProductList } from '@entities/part';
import { useDebounceFn } from '@vueuse/core';
import TengeAmount from '@/shared/ui/TengeAmount.vue';
import { ImageOutline } from '@vicons/ionicons5';

const productStore = useProductStore();
const props = defineProps<{ selectedProducts: ProductList[] }>();
const emit = defineEmits<{
  (e: 'selected', product: ProductList): void;
}>();

const showModal = ref(false);
const searchQuery = ref('');

function isSelected(product: ProductList): boolean {
  return props.selectedProducts.some((p: ProductList) => p.id === product.id);
}

function closeModal() {
  showModal.value = false;
}

const debouncedLoadProducts = useDebounceFn((value: string) => {
  productStore.loadProducts({
    page: 1,
    search: value,
    page_size: 10,
    status: 2
  });
}, 500);

onMounted(() => {
  productStore.loadProducts({ page: 1, page_size: 3, status: 2 });
});
</script>
