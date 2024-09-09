<template>
	<div class="flex gap-2 pt-4">
		<n-input placeholder="Поиск по названий, категорий">
<!--			<template #prefix>-->
<!--				<n-icon :component="MagnifyingGlassIcon" />-->
<!--			</template>-->
		</n-input>
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
import { NInput, NIcon, NButton, NCollapseTransition } from 'naive-ui';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import { ref } from 'vue';
import { SelectMixedOption } from 'naive-ui/es/select/src/interface';
import FilterForm from "@/components/Parts/FilterForm.vue";

const show = ref<boolean>(false);


const statusOptions: SelectMixedOption[] = [{
	label: "Не обработан",
	value: 1
}, {
	label: "В наличии",
	value: 2
}, {
	label: "Зарезервирован",
	value: 3
}, {
	label: "Удален",
	value: 4
}, {
	label: "Продан",
	value: 5
}]


</script>