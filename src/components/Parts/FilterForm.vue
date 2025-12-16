<template>
  <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    <n-form :model="filterStore.filterValues" ref="formRef" class="space-y-3 md:col-span-2 xl:col-span-3">
      <div class="grid gap-3 lg:grid-cols-3">
        <n-form-item label="Производитель" path="manufacturer" class="rounded-2xl bg-white/60 px-3 py-2">
          <n-select placeholder="Выберите" filterable :options="manufacturerStore.manufacturerOptions"
            v-model:value="filterStore.filterValues.manufacturer" @update:value="onUpdateManufacturer" clearable />
        </n-form-item>
        <n-form-item label="Модель" path="modelCar" class="rounded-2xl bg-white/60 px-3 py-2">
          <n-select placeholder="Выберите" filterable :options="manufacturerStore.modelCarOptions"
            v-model:value="filterStore.filterValues.modelCar" clearable />
        </n-form-item>
        <n-form-item label="Склад" path="warehouse" class="rounded-2xl bg-white/60 px-3 py-2">
          <n-select :loading="warehouseStore.isLoading" clearable filterable remote @search="handleSearchWarehouse"
            v-model:value="filterStore.filterValues.warehouse_id" :options="warehouseStore.warehousesOptions"
            placeholder="Выберите склад" />
        </n-form-item>
      </div>

      <div class="grid gap-3 lg:grid-cols-2">
        <n-form-item label="Категория" path="category" class="rounded-2xl bg-white/60 px-3 py-2">
          <n-tree-select placeholder="Выберите варианты" multiple cascade filterable checkable :check-strategy="'parent'"
            :options="categoryStore.categoriesTreeOptions" :value="categoryValue" @update:value="handleUpdateValue" />
        </n-form-item>
        <div class="grid gap-3 sm:grid-cols-2">
          <div v-for="fields in filterStore.filtersForm" :key="fields.key"
            class="rounded-2xl bg-white/60 px-3 py-2">
            <n-form-item :label="fields.title" :path="fields.key">
              <n-select v-if="fields.type == 'select'" multiple placeholder="Выберите вариант"
                v-model:value="filterStore.filterValues[fields.key as FilterKeys]" :options="fields.options">
              </n-select>
              <n-radio-group class="grid grid-cols-2 gap-2" v-else-if="fields.type == 'radio'"
                v-model:value="filterStore.filterValues[fields.key as FilterKeys]" :name="fields.key">
                <n-radio v-for="option in fields.options" :key="option.value" :value="option.value"
                  :label="option.label" />
              </n-radio-group>
            </n-form-item>
          </div>
        </div>
      </div>
    </n-form>
  </div>
</template>
<script setup lang="ts">
import { useFilterStore } from "@/stores/filter-store.ts";
import { onMounted, ref } from "vue";
import type { TreeSelectOption } from "naive-ui";
import {
  NSelect,
  NRadio,
  NForm,
  NFormItem,
  NTreeSelect,
  NRadioGroup,
} from "naive-ui";
import { useCategoryStore } from "@/stores/category-storage";
import { useManufacturerStore } from "@/stores/manufacturer-store";
import { useWarehouseStore } from "@/stores/warehouses-store";
import { computed } from "vue";
const filterStore = useFilterStore();
const categoryStore = useCategoryStore();
const manufacturerStore = useManufacturerStore();
const warehouseStore = useWarehouseStore();
const formRef = ref();

type FilterKeys = keyof typeof filterStore.filterValues;

function handleUpdateValue(
  value: any,
  _: TreeSelectOption | null | Array<TreeSelectOption | null>,
) {
  //@ts-ignore
  //@ts-nocheck
  filterStore.filterValues.category = value.filter((item) => !Number.isNaN(item)).join(",");
}

const categoryValue = computed(() => filterStore.filterValues.category != null
  ? filterStore.filterValues
    .category!.split(',')
    .map((item) => parseInt(item))
  : []
);

// Убираем автоматическое применение фильтров при изменении значений
// watch(filterStore.filterValues, (state) => {
//   productStore.loadProducts(state);
// });

onMounted(() => {
  filterStore.loadFilters();
  categoryStore.loadCategoriesTree();
  warehouseStore.loadWarehouses({});
  manufacturerStore.loadManufacturers();
});

function handleSearchWarehouse(value: string) {
  warehouseStore.loadWarehouses({
    search: value
  })
}

function onUpdateManufacturer(value: number) {
  manufacturerStore.loadModelCars(value);
}

</script>

/*
  check-strategy может быть:
    - 'all' (по умолчанию): возвращает все выбранные узлы (включая родителей и детей)
    - 'parent': возвращает только выбранные родительские узлы
    - 'child': возвращает только выбранные дочерние (leaf) узлы

  Пример:
    <n-tree-select :check-strategy="'all'" ... />
    <n-tree-select :check-strategy="'parent'" ... />
    <n-tree-select :check-strategy="'child'" ... />
*/
