<template>
  <n-form :model="filterStore.filterValues" label-placement="top">
    <!-- Быстрые фильтры -->
    <div class="mb-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-5 border-2 border-blue-200/60">
      <h3 class="mb-3 flex items-center gap-2 text-sm font-bold text-blue-900">
        <n-icon :component="FlashOutline" size="20" class="text-blue-600" />
        Быстрый выбор
      </h3>

      <!-- Популярные производители -->
      <div class="mb-4">
        <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-700">Популярные марки</p>
        <div class="flex flex-wrap gap-2">
          <n-tag
            v-for="brand in popularBrands"
            :key="brand"
            :type="isManufacturerSelected(brand) ? 'success' : 'default'"
            :bordered="!isManufacturerSelected(brand)"
            checkable
            :checked="isManufacturerSelected(brand)"
            @click="toggleQuickManufacturer(brand)"
            size="large"
            round
            class="cursor-pointer font-medium"
            :class="isManufacturerSelected(brand) ? 'shadow-md' : ''"
          >
            {{ brand }}
          </n-tag>
        </div>
      </div>
    </div>

    <!-- Производитель и модель -->
    <div class="space-y-4">
      <div class="rounded-lg bg-white p-4 border border-slate-200">
        <h4 class="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-700">
          <n-icon :component="CarSportOutline" size="16" />
          Автомобиль
        </h4>
        <div class="space-y-3">
          <n-form-item label="Производитель" path="manufacturer" :show-label="true">
            <n-select
              placeholder="Выберите производителя"
              filterable
              :options="manufacturerStore.manufacturerOptions"
              v-model:value="filterStore.filterValues.manufacturer"
              @update:value="onUpdateManufacturer"
              size="small"
            />
          </n-form-item>
          <n-form-item label="Модель" path="modelCar" :show-label="true">
            <n-select
              placeholder="Сначала выберите производителя"
              filterable
              :options="manufacturerStore.modelCarOptions"
              v-model:value="filterStore.filterValues.modelCar"
              size="small"
            />
          </n-form-item>
        </div>
      </div>

      <!-- Категория и склад -->
      <div class="rounded-lg bg-white p-4 border border-slate-200">
        <h4 class="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-700">
          <n-icon :component="GridOutline" size="16" />
          Расположение
        </h4>
        <div class="space-y-3">
          <n-form-item label="Категория" path="category" :show-label="true">
            <n-tree-select
              placeholder="Выберите категорию"
              multiple
              cascade
              filterable
              checkable
              :check-strategy="'parent'"
              :options="categoryStore.categoriesTreeOptions"
              :value="filterStore.filterValues.category != null
                ? filterStore.filterValues.category!.split(',').map((item) => parseInt(item))
                : []
              "
              @update:value="handleUpdateValue"
              size="small"
            />
          </n-form-item>
          <n-form-item label="Склад" path="warehouse" :show-label="true">
            <n-select
              :loading="warehouseStore.isLoading"
              clearable
              filterable
              remote
              @search="handleSearchWarehouse"
              v-model:value="filterStore.filterValues.warehouse_id"
              :options="warehouseStore.warehousesOptions"
              placeholder="Выберите склад"
              size="small"
            />
          </n-form-item>
        </div>
      </div>

      <!-- Динамические фильтры с chips -->
      <div v-if="filterStore.filtersForm.length > 0" class="rounded-lg bg-white p-4 border border-slate-200">
        <h4 class="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-700">
          <n-icon :component="OptionsOutline" size="16" />
          Характеристики
        </h4>
        <div class="space-y-4">
          <div v-for="fields in filterStore.filtersForm" :key="fields.key">
            <n-form-item :label="fields.title" :path="fields.key" :show-label="true">
              <!-- Chips для select -->
              <div v-if="fields.type == 'select'" class="flex flex-wrap gap-2">
                <n-tag
                  v-for="option in fields.options"
                  :key="option.value"
                  checkable
                  :checked="isOptionSelected(fields.key, option.value)"
                  @update:checked="(checked: boolean) => toggleSelectOption(fields.key, option.value, checked)"
                  size="large"
                  round
                  class="cursor-pointer font-semibold transition-all duration-200"
                  :class="isOptionSelected(fields.key, option.value) ? 'shadow-lg scale-105' : 'hover:shadow-sm bg-slate-100 text-slate-600'"
                  :style="isOptionSelected(fields.key, option.value) ? 'background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; border: none;' : ''"
                >
                  {{ option.label }}
                </n-tag>
              </div>

              <!-- Chips для radio -->
              <div v-else-if="fields.type == 'radio'" class="flex flex-wrap gap-2">
                <n-tag
                  v-for="option in fields.options"
                  :key="option.value"
                  checkable
                  :checked="filterStore.filterValues[fields.key as FilterKeys] === option.value"
                  @click="filterStore.filterValues[fields.key as FilterKeys] = option.value"
                  size="large"
                  round
                  class="cursor-pointer font-semibold transition-all duration-200"
                  :class="filterStore.filterValues[fields.key as FilterKeys] === option.value ? 'shadow-lg scale-105' : 'hover:shadow-sm bg-slate-100 text-slate-600'"
                  :style="filterStore.filterValues[fields.key as FilterKeys] === option.value ? 'background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; border: none;' : ''"
                >
                  {{ option.label }}
                </n-tag>
              </div>
            </n-form-item>
          </div>
        </div>
      </div>
    </div>
  </n-form>
</template>
<script setup lang="ts">
import { useFilterStore } from "@/stores/filter-store.ts";
import { onMounted } from "vue";
import type { TreeSelectOption } from "naive-ui";
import {
  NSelect,
  NForm,
  NFormItem,
  NTreeSelect,
  NTag,
  NIcon,
} from "naive-ui";
import { CarSportOutline, GridOutline, OptionsOutline, FlashOutline } from '@vicons/ionicons5';
import { useCategoryStore } from "@/stores/category-storage";
import { useManufacturerStore } from "@/stores/manufacturer-store";
import { useWarehouseStore } from "@/stores/warehouses-store";

const filterStore = useFilterStore();
const categoryStore = useCategoryStore();
const manufacturerStore = useManufacturerStore();
const warehouseStore = useWarehouseStore();

type FilterKeys = keyof typeof filterStore.filterValues;

// Популярные бренды для быстрого выбора
const popularBrands = [
  'AUDI',
  'BMW',
  'TOYOTA',
  'MERCEDES-BENZ',
  'KIA',
  'MAZDA',
  'FORD',
  'VOLVO',
  'LADA',
  'DAEWOO'
];

function handleUpdateValue(
  value: any,
  _: TreeSelectOption | null | Array<TreeSelectOption | null>,
) {
  filterStore.filterValues.category = value.filter((item: any) => !Number.isNaN(item)).join(",");
}

// Проверка, выбрана ли опция в select (множественный выбор)
function isOptionSelected(key: string, value: any): boolean {
  const currentValue = filterStore.filterValues[key as FilterKeys];
  if (Array.isArray(currentValue)) {
    return currentValue.includes(value);
  }
  return false;
}

// Переключение опции в select (множественный выбор)
function toggleSelectOption(key: string, value: any, checked: boolean) {
  const currentValue = filterStore.filterValues[key as FilterKeys];

  if (!Array.isArray(currentValue)) {
    filterStore.filterValues[key as FilterKeys] = checked ? [value] : [] as any;
    return;
  }

  if (checked) {
    if (!currentValue.includes(value)) {
      filterStore.filterValues[key as FilterKeys] = [...currentValue, value] as any;
    }
  } else {
    filterStore.filterValues[key as FilterKeys] = currentValue.filter((v: any) => v !== value) as any;
  }
}

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

// Проверка, выбран ли производитель из быстрых фильтров
function isManufacturerSelected(brandName: string): boolean {
  const selectedManufacturer = manufacturerStore.manufacturerOptions.find(
    (m: any) => m.value === filterStore.filterValues.manufacturer
  );
  return selectedManufacturer?.label === brandName;
}

// Переключение производителя из быстрых фильтров
function toggleQuickManufacturer(brandName: string) {
  const manufacturer = manufacturerStore.manufacturerOptions.find(
    (m: any) => m.label === brandName
  );

  if (manufacturer) {
    if (filterStore.filterValues.manufacturer === manufacturer.value) {
      // Если уже выбран, снимаем выбор
      filterStore.filterValues.manufacturer = null;
      filterStore.filterValues.modelCar = null;
    } else {
      // Выбираем производителя
      filterStore.filterValues.manufacturer = manufacturer.value;
      filterStore.filterValues.modelCar = null;
      // Загружаем модели для этого производителя
      manufacturerStore.loadModelCars(manufacturer.value);
    }
  }
}

</script>

<style scoped>
/* Анимация для chips */
.n-tag {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.n-tag:hover {
  transform: translateY(-1px);
}

.n-tag:active {
  transform: translateY(0);
}

/* Улучшенная тень для активных chips */
.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.scale-105 {
  transform: scale(1.05);
}

/* Hover эффект для неактивных chips */
.hover\:shadow-sm:hover {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
</style>

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
