<script lang="ts" setup>
import PaginationItem from '@/components/Pagination/pagination-item.vue';
import {ref, computed} from 'vue';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';

const props = defineProps(['lastPage']);
const emits = defineEmits(['onChangedPage']);


const numbers = computed(()=>{
	const numbers = [1];
	const start = activePage.value - 9;
	const end =activePage.value + 9;
	for (let page = start; page<end;page++) {
		if (page > 1 && numbers.length <= 10 && page < props.lastPage) {
			numbers.push(page);
		}
	}
	numbers.push(props.lastPage)
	return numbers;
})

const activePage = ref<number>(1);


function onChangedPage(action: string, page?: number) {
	let aP = activePage.value;
	if (action == '=') {
		if (page! > props.lastPage) {
			return;
		}
		activePage.value = page!;
	}
	else if (action == '+') {
		const v = aP += 1;
		if (v > props.lastPage) {
			return
		}
		activePage.value += 1;
	}
	else if (action == '-') {
		const v = aP -= 1;
		if (v <= 0) {
			return
		}
		activePage.value -= 1;
	}
	emits('onChangedPage', activePage.value);	
}


</script>
<template>
	<div class="px-4 py-4 items-center overflow-scroll flex gap-2">
		<div v-if="activePage > 1" class="cursor-pointer" @click="onChangedPage('-')"><ChevronLeftIcon class="w-6 h-6"></ChevronLeftIcon></div>
		<PaginationItem @click="onChangedPage('=',item)" :item="item" :isActive="item == activePage" v-for="item in numbers"></PaginationItem>
		<div v-if="activePage < lastPage" class="cursor-pointer" @click="onChangedPage('+')"><ChevronRightIcon class="w-6 h-6"></ChevronRightIcon></div>
	</div>
</template>
<style>
	
</style>
