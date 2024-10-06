<template>
	<div class="flex gap-2 pt-4">
		<n-input class="!min-w-[100px]" placeholder="Поиск по названий, категорий"></n-input>
		<n-button round type="primary">Поиск</n-button>
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
const show = ref<boolean>(false);
</script>