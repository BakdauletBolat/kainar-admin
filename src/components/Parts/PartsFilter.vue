<template>
	<div class="flex gap-2 pt-4">
		<n-input placeholder="Поиск по названий, категорий">
			<template #prefix>
				<n-icon :component="MagnifyingGlassIcon" />
			</template>
		</n-input>
		<n-button round type="primary">Поиск</n-button>
		<n-button @click="show = !show" :type="show == true ? 'primary' : 'default'" round secondary>Фильтр</n-button>
	</div>
	<div class="py-4">
		<n-collapse-transition :show="show">
			<div>
				<div class="grid items-start grid-cols-3 gap-2">
					<div class="grid gap-2">
						<n-select filterable :on-update-value="updateModelCars" placeholder="Производитель"
							v-model:value="filterForm.manufacturer" :options="manufacturerOptions"></n-select>
						<n-select filterable placeholder="Модель" :disabled="!filterForm.manufacturer"
							v-model:value="filterForm.modelCar" :options="modelCarOptions"></n-select>
						<n-select placeholder="Цвет" v-model:value="filterForm.color"
							:options="colorsOptions"></n-select>
						<n-select placeholder="Статус" v-model:value="filterForm.status"
							:options="statusOptions"></n-select>
					</div>

					<div class="grid gap-2">
						<n-select placeholder="Телосложение" :options="bodyTypesOptions"
							v-model:value="filterForm.bodyType"></n-select>
						<n-select placeholder="Тип топлива" :options="fuelTypesOptions"
							v-model:value="filterForm.fuelType"></n-select>
						<n-select placeholder="Тип вождение" :options="driveTypesOptions"
							v-model:value="filterForm.driveType"></n-select>
						<n-select placeholder="Тип КПП" :options="gearTypesOptions"
							v-model:value="filterForm.gearType"></n-select>
					</div>
					<div class="grid gap-2 grid-cols-2 justify-end">
						<n-select filterable placeholder="Вместимость от" v-model:value="filterForm.capacityFrom"
							:options="capacitiesOptions" clearable />
						<n-select filterable placeholder="Вместимость до" v-model:value="filterForm.capacityTo"
							:options="capacitiesOptions" clearable />
						<n-select filterable placeholder="Мощность от" v-model:value="filterForm.powerFrom"
							:options="powersOptions" />
						<n-select filterable placeholder="Мощность до" v-model:value="filterForm.powerTo"
							:options="powersOptions" />
						<n-input-number :step="10000" placeholder="Цена от" v-model:value="filterForm.priceStart">
							<template #prefix>
								₸
							</template>
						</n-input-number>
						<n-input-number :step="10000" placeholder="Цена до" v-model:value="filterForm.priceEnd">
							<template #prefix>
								₸
							</template>
						</n-input-number>
						<n-button @click="emit('update', filterForm)" type="primary" round class="w-full">Поиск</n-button>	
					</div>
				</div>
			</div>
		</n-collapse-transition>
	</div>
</template>
<script lang="ts" setup>
import { NInput, NInputNumber, NIcon, NButton, NCollapseTransition, NSelect } from 'naive-ui';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import { computed, onMounted, reactive, ref } from 'vue';
import { getCarFilters, getCarManufacturers, getModelCars } from '@/apis/repo';
import { ICarFiltersData } from '@/stores/models';
import { SelectMixedOption } from 'naive-ui/es/select/src/interface';


interface IFilterForm {
	capacityFrom?: number;
	capacityTo?: number;
	manufacturer?: number;
	modelCar?: number | null;
	yearStart?: string;
	yearEnd?: string;
	fuelType?: string;
	driveType?: string;
	gearType?: string;
	color?: string;
	powerFrom?: number;
	powerTo?: number;
	status?: string;
	priceStart?: number;
	priceEnd?: number;
	bodyType?: number
}

const emit = defineEmits(['update']);

const show = ref<boolean>(false);

const filters = ref<ICarFiltersData | undefined>(undefined);

const filterForm = reactive<IFilterForm>({
	capacityFrom: undefined,
	capacityTo: undefined,
	manufacturer: undefined,
	modelCar: undefined,

});


const manufacturerOptions = ref<SelectMixedOption[]>([]);
const modelCarOptions = ref<SelectMixedOption[]>([]);

//@ts-ignore
const powersOptions = computed<SelectMixedOption[]>(() => {
	if (filters == undefined) {
		return {}
	}
	return filters.value?.powers.sort().map(item => {
		return {
			label: `${item} л. c`,
			value: item
		}
	})
})

//@ts-ignore
const capacitiesOptions = computed<SelectMixedOption[] | undefined>(() => {
	if (filters == undefined) {
		return undefined;
	}
	return filters.value!.capacities.sort().map((item: number) => {
		return {
			label: item,
			value: item
		}
	});
});


const bodyTypesOptions = computed<SelectMixedOption[] | undefined>(() => {
	if (filters == undefined) {
		return undefined;
	}
	return filters.value!.body_types.map((item) => {
		return {
			label: item.name,
			value: item.id
		}
	});
});

const fuelTypesOptions = computed<SelectMixedOption[] | undefined>(() => {
	if (filters == undefined) {
		return undefined;
	}
	return filters.value!.fuel_types.map((item) => {
		return {
			label: item.name,
			value: item.id
		}
	});
});

const driveTypesOptions = computed<SelectMixedOption[] | undefined>(() => {
	if (filters == undefined) {
		return undefined;
	}
	return filters.value!.drive_types.map((item) => {
		return {
			label: item.name,
			value: item.id
		}
	});
});

const gearTypesOptions = computed<SelectMixedOption[] | undefined>(() => {
	if (filters == undefined) {
		return undefined;
	}
	return filters.value!.gear_types.map((item) => {
		return {
			label: item.name,
			value: item.id
		}
	});
});

const colorsOptions = computed<SelectMixedOption[] | undefined>(() => {
	if (filters == undefined) {
		return undefined;
	}
	return filters.value!.colors.map((item) => {
		return {
			label: item.name,
			value: item.id
		}
	});
});

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

const updateModelCars = (value: number) => {
	filterForm.modelCar = null;
	getModelCars(value).then(res => {
		modelCarOptions.value = res.data.results.map(item => {
			return {
				label: item.name,
				value: item.id
			}
		})
	})
}

onMounted(() => {
	getCarManufacturers().then(res => {
		manufacturerOptions.value = res.data.results.map((item) => {
			return {
				label: item.name,
				value: item.id
			}
		});
	});
	getCarFilters().then(res => {
		filters.value = res.data;
	})
})


</script>