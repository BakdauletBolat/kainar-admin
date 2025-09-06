<template>
	<div class="flex gap-2 pt-4 pb-4">
		<n-input v-model:value="inputValue" class="!min-w-[100px]" 
		placeholder="Поиск по названий, категорий" 
		@keyup.enter="searchProducts"></n-input>
		<n-button @click="searchProducts" round type="primary">Поиск</n-button>
		<n-button @click="showModal = true" round secondary>Фильтр</n-button>
	</div>
	
	<n-modal v-model:show="showModal" preset="card" title="Фильтры" style="margin-inline: 150px; margin-block: 20px;">
		<template #header-extra>
			<div class="flex justify-between items-center gap-2 w-full">
				<span class="text-lg font-medium">Фильтры </span>
				<div class="flex gap-2">
					<n-button @click="resetFilters" secondary>Сбросить</n-button>
					<n-button @click="applyFilters" type="primary">Применить</n-button>
				</div>
			</div>
		</template>
		<div class="p-4">
			<filter-form></filter-form>
		</div>
	</n-modal>
</template>
<script lang="ts" setup>
import { NInput, NButton, NModal } from 'naive-ui';
import { ref, watch } from 'vue';
import FilterForm from "@/components/Parts/FilterForm.vue";
import { useProductStore } from '@/stores/product-store';
import {useFilterStore} from "@/stores/filter-store.ts";

const showModal = ref<boolean>(false);
const inputValue = ref<string>('');
const productStore = useProductStore();
const filterStore = useFilterStore();

let searchTimeout: number | null = null;



async function searchProducts() {
	await productStore.loadProducts({...filterStore.filterValues, search: inputValue.value, page_size: 10})
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
	await productStore.loadProducts({...filterStore.filterValues, search: inputValue.value, page_size: 10})
	showModal.value = false;
}

function resetFilters() {
	filterStore.clearValues();
	showModal.value = false;
}

</script>