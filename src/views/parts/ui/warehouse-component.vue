<template>
    <div>
        <!-- Выпадающее меню для выбора статуса -->
        <n-popover v-if="warehouse" v-model:show="popoverRef" trigger="click" placement="bottom">
            <template #trigger>
                <div v-if="view_mode == 'named'" class="cursor-pointer">{{ warehouse.name }}</div>
                <n-button v-if="view_mode == 'to_move'">Переместить</n-button>
            </template>
            <n-card>
                <div class="flex gap-2 items-start">
                    <div class="gap-2 flex flex-col">
                        <span>Отправная точка</span>
                        <div class="text-nowrap text-2xl">
                            {{ warehouse.name }}
                        </div>
                    </div>
                    <div class="gap-2 flex flex-col">
                        <span>Пункт назначения</span>
                        <n-select :loading="warehouseStore.isLoading" clearable filterable remote
                            @search="handleSearchWarehouse" v-model:value="editRef"
                            :options="warehouseStore.warehousesOptions" placeholder="Выберите склад" />
                    </div>

                </div>
                <n-space justify="end" class="mt-4">
                    <n-button @click="onChange" type="primary">Переместить</n-button>
                </n-space>
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
        source_warehouse_id: props.warehouse.id,
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
