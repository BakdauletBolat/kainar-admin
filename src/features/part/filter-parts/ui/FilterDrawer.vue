<template>
  <n-modal
    v-model:show="isOpen"
    preset="card"
    :style="{ maxWidth: '800px', width: '90%' }"
    :bordered="false"
    :segmented="{
      content: 'soft',
      footer: 'soft'
    }"
    :closable="true"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-xl font-bold text-slate-900">Фильтры</h3>
          <p v-if="activeFiltersCount > 0" class="mt-1 text-sm text-slate-600">
            Активно {{ activeFiltersCount }} {{ getFilterWord(activeFiltersCount) }}
          </p>
        </div>
      </div>
    </template>

    <div class="space-y-6 overflow-y-auto" style="max-height: 60vh;">
      <!-- Результаты поиска -->
      <div v-if="showResults" class="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 border-2 border-blue-300/50 shadow-md">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <p class="text-xs font-bold uppercase tracking-wide text-blue-700">Результаты фильтрации</p>
            <p class="mt-2 text-4xl font-black text-blue-900">
              {{ productStore.productsCount.toLocaleString('ru-RU') }}
            </p>
            <p class="mt-1 text-sm font-medium text-blue-700">
              {{ getProductWord(productStore.productsCount) }} найдено
            </p>
          </div>
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <n-icon :component="SearchOutline" size="32" class="text-blue-600" />
          </div>
        </div>
      </div>

      <!-- Активные фильтры -->
      <div v-if="activeFiltersCount > 0" class="space-y-3">
        <div class="flex items-center justify-between">
          <p class="text-sm font-bold text-slate-700">Активные фильтры</p>
          <n-button text size="small" @click="clearAllFilters" class="text-slate-600 hover:text-slate-900">
            Очистить все
          </n-button>
        </div>
        <div class="flex flex-wrap gap-2">
          <n-tag
            v-for="filter in activeFiltersList"
            :key="filter.key"
            closable
            @close="clearFilter(filter.key)"
            type="info"
            size="medium"
            round
          >
            {{ filter.label }}
          </n-tag>
        </div>
      </div>

      <!-- Форма фильтров -->
      <div class="space-y-4">
        <filter-form />
      </div>
    </div>

    <template #footer>
      <div class="flex w-full flex-col gap-3 px-2">
        <!-- Счетчик результатов -->
        <div v-if="showResults" class="flex items-center justify-center gap-2 text-sm">
          <span class="font-medium text-slate-600">Найдено:</span>
          <span class="rounded-full bg-blue-100 px-3 py-1 font-bold text-blue-700">
            {{ productStore.productsCount.toLocaleString('ru-RU') }} {{ getProductWord(productStore.productsCount) }}
          </span>
        </div>

        <!-- Кнопки -->
        <div class="flex gap-3">
          <n-button @click="handleReset" secondary size="large" round class="flex-1">
            Сбросить
          </n-button>
          <n-button @click="handleApply" type="primary" size="large" round :loading="productStore.isLoadingProducts" class="flex-1">
            Показать результаты
          </n-button>
        </div>
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { NModal, NButton, NTag, NIcon } from 'naive-ui';
import { computed, ref, watch } from 'vue';
import { SearchOutline } from '@vicons/ionicons5';
import FilterForm from './FilterForm.vue';
import { usePartStore as useProductStore } from '@entities/part';
import { useFilterStore } from '@entities/filter';
import { useManufacturerStore } from '@entities/manufacturer';
import { useWarehouseStore } from '@entities/warehouse';

const props = defineProps<{
  open: boolean;
  searchValue?: string;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  'apply': [];
  'reset': [];
}>();

const productStore = useProductStore();
const filterStore = useFilterStore();
const manufacturerStore = useManufacturerStore();
const warehouseStore = useWarehouseStore();

const showResults = ref(false);
let searchTimeout: number | null = null;

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

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

// Список активных фильтров для отображения
const activeFiltersList = computed(() => {
  const filters: Array<{ key: string; label: string }> = [];
  const values = filterStore.filterValues;

  if (values.manufacturer) {
    const manufacturer = manufacturerStore.manufacturerOptions.find(
      (m: any) => m.value === values.manufacturer
    );
    if (manufacturer) {
      filters.push({ key: 'manufacturer', label: `Производитель: ${manufacturer.label}` });
    }
  }

  if (values.modelCar) {
    const model = manufacturerStore.modelCarOptions.find(
      (m: any) => m.value === values.modelCar
    );
    if (model) {
      filters.push({ key: 'modelCar', label: `Модель: ${model.label}` });
    }
  }

  if (values.category) {
    filters.push({ key: 'category', label: `Категория выбрана` });
  }

  if (values.warehouse_id) {
    const warehouse = warehouseStore.warehousesOptions.find(
      (w: any) => w.value === values.warehouse_id
    );
    if (warehouse) {
      filters.push({ key: 'warehouse_id', label: `Склад: ${warehouse.label}` });
    }
  }

  if (values.status !== null && values.status !== undefined) {
    // Маппинг числовых значений статусов на текстовые названия
    const statusLabels: Record<number, string> = {
      1: 'Необработан',
      2: 'В наличии',
      3: 'Зарезервирован',
      4: 'Удален',
      5: 'Продан'
    };
    const statusName = statusLabels[values.status] || values.status;
    filters.push({ key: 'status', label: `Статус: ${statusName}` });
  }

  // Добавляем динамические фильтры
  filterStore.filtersForm.forEach((field: any) => {
    const value = values[field.key as keyof typeof values];
    if (value !== null && value !== undefined && value !== '') {
      filters.push({ key: field.key, label: `${field.title}` });
    }
  });

  return filters;
});

function getFilterWord(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'фильтров';
  }

  if (lastDigit === 1) {
    return 'фильтр';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'фильтра';
  }

  return 'фильтров';
}

function getProductWord(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'товаров';
  }

  if (lastDigit === 1) {
    return 'товар';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'товара';
  }

  return 'товаров';
}

function clearFilter(key: string) {
  (filterStore.filterValues as any)[key] = null;
}

function clearAllFilters() {
  filterStore.clearValues();
}

function handleApply() {
  // Просто закрываем модальное окно
  // Фильтры уже применены автоматически через watch
  emit('apply');
}

function handleReset() {
  filterStore.clearValues();
  emit('reset');
  // Не скрываем результаты, чтобы пользователь видел количество после сброса
}

// Автоматический поиск при изменении фильтров
watch(() => filterStore.filterValues, () => {
  if (!props.open) return; // Не делаем поиск если модалка закрыта

  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(async () => {
    showResults.value = true;
    await productStore.loadProducts({
      ...filterStore.filterValues,
      search: props.searchValue,
      page_size: 10,
      page: 1
    });
  }, 500); // Задержка 500ms для debounce
}, { deep: true });

// Следим за открытием drawer для скрытия результатов при следующем открытии
watch(() => props.open, (newValue) => {
  if (!newValue) {
    // Drawer закрыт, можно сбросить showResults при следующем открытии
    setTimeout(() => {
      if (!props.open) {
        showResults.value = false;
      }
    }, 300);
  }
});
</script>

<style scoped>
/* Прозрачный фон для модального окна */
:deep(.n-modal-mask) {
  background-color: rgba(0, 0, 0, 0.25) !important;
  backdrop-filter: blur(4px);
}

/* Стиль для карточки модального окна */
:deep(.n-card) {
  background-color: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: blur(10px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
}

/* Footer */
:deep(.n-card__footer) {
  padding: 16px 20px !important;
}

/* Прокрутка с красивым скроллбаром */
:deep(.n-card__content) {
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
}

:deep(.n-card__content)::-webkit-scrollbar {
  width: 6px;
}

:deep(.n-card__content)::-webkit-scrollbar-track {
  background: transparent;
}

:deep(.n-card__content)::-webkit-scrollbar-thumb {
  background-color: rgba(148, 163, 184, 0.3);
  border-radius: 3px;
}

:deep(.n-card__content)::-webkit-scrollbar-thumb:hover {
  background-color: rgba(148, 163, 184, 0.5);
}
</style>
