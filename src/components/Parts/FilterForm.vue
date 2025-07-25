<template>
  <n-form :model="filterStore.filterValues" ref="formRef">
    <div>
      <n-form-item label="Искать по производителю" path="manufacturer">
        <n-select placeholder="Выберите варианты" filterable :options="manufacturerStore.manufacturerOptions"
          v-model:value="filterStore.filterValues.manufacturer"
                  @update:value="onUpdateManufacturer"
          />
      </n-form-item>
    </div>
    <div>
      <n-form-item label="Искать по модели" path="modelCar">
        <n-select placeholder="Выберите варианты" filterable
                  :options="manufacturerStore.modelCarOptions"
                  v-model:value="filterStore.filterValues.modelCar" />
      </n-form-item>
    </div>
    <div>
      <n-form-item label="Искать по категории" path="category">
        <n-tree-select placeholder="Выберите варианты" multiple cascade filterable checkable :check-strategy="'parent'"
          :options="categoryStore.categoriesTreeOptions" :value="filterStore.filterValues.category != null
            ? filterStore.filterValues
              .category!.split(',')
              .map((item) => parseInt(item))
            : []
            " @update:value="handleUpdateValue" />
      </n-form-item>
    </div>
    <div>
      <n-form-item label="Склад" path="warehouse">
        <n-select :loading="warehouseStore.isLoading" clearable filterable remote @search="handleSearchWarehouse"
          v-model:value="filterStore.filterValues.warehouse_id" :options="warehouseStore.warehousesOptions"
          placeholder="Выберите склад" />
      </n-form-item>
    </div>
    <div v-for="fields in filterStore.filtersForm">
      <n-form-item :label="fields.title" :path="fields.key">
        <n-select v-if="fields.type == 'select'" multiple placeholder="Выберите один из вариантов"
          v-model:value="filterStore.filterValues[fields.key as FilterKeys]" :options="fields.options">
        </n-select>
        <n-radio-group class="grid grid-cols-2 gap-1" v-else-if="fields.type == 'radio'"
          v-model:value="filterStore.filterValues[fields.key as FilterKeys]" :name="fields.key">
          <n-radio v-for="option in fields.options" :key="option.value" :value="option.value" :label="option.label" />
        </n-radio-group>
      </n-form-item>
    </div>
  </n-form>
</template>
<script setup lang="ts">
import { useFilterStore } from "@/stores/filter-store.ts";
import { onMounted, ref, watch } from "vue";
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
import { useProductStore } from '@/stores/product-store'
import { useWarehouseStore } from "@/stores/warehouses-store";
const filterStore = useFilterStore();
const categoryStore = useCategoryStore();
const manufacturerStore = useManufacturerStore();
const warehouseStore = useWarehouseStore();
const productStore = useProductStore();
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

watch(filterStore.filterValues, (state) => {
  productStore.loadProducts(state);
});

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
