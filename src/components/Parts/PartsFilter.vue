<template>
	<div class="flex gap-2 pt-4">
		<n-input v-model:value="inputValue" class="!min-w-[100px]" placeholder="Поиск по названий, категорий"></n-input>
		<n-button @click="searchProducts" round type="primary">Поиск</n-button>
		<n-button @click="show = !show" :type="show ? 'primary' : 'default'" round secondary>Фильтр</n-button>
	</div>
	<div class="py-4">
		<n-collapse-transition :show="show">
			<filter-form></filter-form>
		</n-collapse-transition>
	</div>
</template>
<script lang="ts" setup>
import { NInput, NButton, NCollapseTransition } from 'naive-ui';
import { ref } from 'vue';
import FilterForm from "@/components/Parts/FilterForm.vue";
import { useProductStore } from '@/stores/product-store';

const show = ref<boolean>(false);
const inputValue = ref<string>('');
const productStore = useProductStore();

async function searchProducts() {
	productStore.loadProducts({
		search: inputValue.value
	})
}
</script>