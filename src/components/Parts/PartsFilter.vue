<template>
  <div class="rounded-3xl bg-white px-5 py-4 shadow-none border border-slate-200/70">
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
        <n-badge :value="activeFiltersCount" :max="99" :show="activeFiltersCount > 0">
          <n-button quaternary round size="large" @click="openFilters">
            Фильтры
          </n-button>
        </n-badge>
      </div>
    </div>

    <!-- Filter Modal -->
    <filter-drawer
      v-model:open="drawerOpen"
      :search-value="inputValue"
      @apply="applyFilters"
      @reset="resetFilters"
    />
  </div>
</template>
<script lang="ts" setup>
import { NInput, NButton, NIcon, NBadge } from 'naive-ui';
import { ref, watch, computed } from 'vue';
import { SearchOutline } from '@vicons/ionicons5';
import FilterDrawer from "@/components/Parts/FilterDrawer.vue";
import { useProductStore } from '@/stores/product-store';
import { useFilterStore } from "@/stores/filter-store.ts";

const inputValue = ref<string>('');
const productStore = useProductStore();
const filterStore = useFilterStore();
const drawerOpen = ref(false);

let searchTimeout: number | null = null;

// Подсчет активных фильтров
const activeFiltersCount = computed(() => {
  let count = 0;
  const values = filterStore.filterValues;

  Object.entries(values).forEach(([key, value]) => {
    if (key === 'search') return; // Не считаем поиск
    if (value !== null && value !== undefined && value !== '') {
      count++;
    }
  });

  return count;
});

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

function applyFilters() {
	// Фильтры уже применяются автоматически, просто закрываем модалку
	drawerOpen.value = false;
}

function resetFilters() {
	filterStore.clearValues();
	inputValue.value = '';
	if (searchTimeout) {
		clearTimeout(searchTimeout);
		searchTimeout = null;
	}
	productStore.loadProducts({ ...filterStore.filterValues, page_size: 10, page: 1 });
	// Не закрываем модалку при сбросе
}

function openFilters() {
	drawerOpen.value = true;
}

</script>
