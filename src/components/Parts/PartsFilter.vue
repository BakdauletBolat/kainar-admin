<template>
  <div class="space-y-4">
    <div class="rounded-3xl border border-slate-200/60 bg-white p-4 shadow-none">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div class="flex-1">
          <n-input
            v-model:value="inputValue"
            clearable
            placeholder="Поиск по названию, категории или производителю"
            round
            size="large"
            @keyup.enter="searchProducts"
          >
            <template #prefix>
              <n-icon :component="SearchOutline" class="text-slate-500" />
            </template>
          </n-input>
          <p class="mt-2 text-xs text-slate-500">
            Полнотекстовый поиск по названию, категории, модели, производителю и ID детали
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <n-button @click="searchProducts" round type="primary" size="large">Поиск</n-button>
          <n-button @click="resetFilters" tertiary round size="large">Сбросить</n-button>
          <n-button quaternary round size="large" @click="toggleFilters">
            {{ filtersExpanded ? 'Скрыть фильтры' : 'Фильтры' }}
          </n-button>
        </div>
      </div>
    </div>
    <n-collapse-transition :show="filtersExpanded">
      <div class="rounded-3xl border border-slate-200/60 bg-slate-50/70 p-4 shadow-none">
        <div class="mb-3 flex items-center justify-between">
          <span class="text-sm font-semibold text-slate-900">Точный отбор</span>
          <n-button quaternary size="small" round @click="resetFilters">Сбросить</n-button>
        </div>
        <div class="space-y-4">
          <filter-form></filter-form>
          <div class="flex justify-end gap-2">
            <n-button @click="resetFilters" secondary round>Очистить</n-button>
            <n-button @click="applyFilters" type="primary" round>Применить</n-button>
          </div>
        </div>
      </div>
    </n-collapse-transition>
  </div>
</template>
<script lang="ts" setup>
import { NInput, NButton, NIcon, NCollapseTransition } from 'naive-ui';
import { ref, watch } from 'vue';
import { SearchOutline } from '@vicons/ionicons5';
import FilterForm from "@/components/Parts/FilterForm.vue";
import { useProductStore } from '@/stores/product-store';
import {useFilterStore} from "@/stores/filter-store.ts";

const inputValue = ref<string>('');
const productStore = useProductStore();
const filterStore = useFilterStore();
const filtersExpanded = ref(false);

let searchTimeout: number | null = null;

async function searchProducts() {
	await productStore.loadProducts({...filterStore.filterValues, search: inputValue.value, page_size: 10, page: 1})
}

// Автоматический поиск с задержкой 400ms
watch(inputValue, () => {
	if (searchTimeout) {
		clearTimeout(searchTimeout);
	}
	
	searchTimeout = setTimeout(() => {
		searchProducts();
	}, 400);
});

async function applyFilters() {
	await productStore.loadProducts({...filterStore.filterValues, search: inputValue.value, page_size: 10, page: 1})
}

function resetFilters() {
	filterStore.clearValues();
	inputValue.value = '';
	if (searchTimeout) {
		clearTimeout(searchTimeout);
		searchTimeout = null;
	}
	productStore.loadProducts({ ...filterStore.filterValues, page_size: 10, page: 1 });
}

function toggleFilters() {
	filtersExpanded.value = !filtersExpanded.value;
}

</script>
