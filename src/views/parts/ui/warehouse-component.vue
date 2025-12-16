<template>
  <div>
    <n-popover v-if="warehouse" v-model:show="popoverRef" trigger="click" placement="bottom-start">
      <template #trigger>
        <div
          v-if="view_mode == 'named'"
          class="inline-flex cursor-pointer items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-800 hover:bg-slate-200"
        >
          {{ warehouse.name || 'Назначить склад' }}
        </div>
        <n-button v-if="view_mode == 'to_move'" tertiary round>
          {{ warehouse?.name ? 'Переместить' : 'Назначить' }}
        </n-button>
      </template>
      <n-card class="w-[320px]">
        <div class="flex flex-col gap-3">
          <div class="space-y-1">
            <p class="text-xs uppercase tracking-[0.08em] text-slate-500">Текущий</p>
            <p class="text-sm font-semibold text-slate-900">{{ warehouse?.name || 'Не назначен' }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-xs uppercase tracking-[0.08em] text-slate-500">Назначить / Переместить</p>
            <n-select
              :loading="warehouseStore.isLoading"
              clearable
              filterable
              remote
              @search="handleSearchWarehouse"
              v-model:value="editRef"
              :options="warehouseStore.warehousesOptions"
              placeholder="Выберите склад"
            />
          </div>
          <n-space justify="end">
            <n-button quaternary @click="popoverRef = false">Отмена</n-button>
            <n-button @click="onChange" type="primary">Сохранить</n-button>
          </n-space>
        </div>
      </n-card>
    </n-popover>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { NSelect, NPopover, NSpace, NCard, NButton } from 'naive-ui'
import { useWarehouseStore } from '@/stores/warehouses-store';

// Входные параметры
const props = defineProps(['warehouse', 'view_mode'])

const warehouseStore = useWarehouseStore();
const popoverRef = ref<boolean>(false);
const editRef = ref<number>()
// Определение событий для передачи изменений
const emit = defineEmits(['onChangedProp'])

// Логика сохранения изменений
function onChange() {
  emit('onChangedProp', {
    source_warehouse_id: props.warehouse?.id ?? null,
    dest_warehouse_id: editRef.value
  })
  popoverRef.value = false
}

function handleSearchWarehouse(value: string) {
    warehouseStore.loadWarehouses({
        search: value
    })
}


onMounted(() => {
    warehouseStore.loadWarehouses({
        page_size: 10,
        page: 1
    })
})


</script>

<style scoped></style>
