<template>
    <div>
        <!-- Выпадающее меню для выбора статуса -->
        <n-popover v-model:show="popoverRef" trigger="click" placement="bottom">
            <template #trigger>
                <!-- Отображение текущего статуса в виде тега с различным стилем -->
                <n-tag :type="getStatusType(getStatusValue(value!))" class="cursor-pointer">
                    {{ value }}
                </n-tag>
            </template>
            <!-- Внутри поповера выбор статуса через n-select -->
            <n-card>
                <n-select class="min-w-[200px]" v-model:value="editRef" :options="statusOptions"
                    placeholder="Выберите статус" />
                <n-space justify="end" class="mt-4">
                    <n-button @click="onChange" type="primary">Сохранить</n-button>
                </n-space>
            </n-card>
        </n-popover>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { NTag, NSelect, NPopover, NSpace, NCard, NButton } from 'naive-ui'

// Входные параметры
const props = defineProps({
    value: {
        type: String,
        required: false
    }
})

// Определение событий для передачи изменений
const emit = defineEmits(['onChangedProp'])

// Локальная переменная для редактирования
const editRef = ref<number>(0)
const popoverRef = ref<boolean>(false)

// Опции для выбора статуса
const statusOptions = ref([
    { label: 'Необработан', value: 1 },
    { label: 'В наличии', value: 2 },
    { label: 'Зарезервирован', value: 3 },
    { label: 'Удален', value: 4 },
    { label: 'Продан', value: 5 }
])

// Получение метки для статуса
const getStatusLabel = (status: number) => {
    const statusMap: any = {
        1: 'Необработан',
        2: 'В наличии',
        3: 'Зарезервирован',
        4: 'Удален',
        5: 'Продан'
    }
    return statusMap[status] || 'Неизвестный статус'
}


const getStatusValue = (status: string) => {
    const statusMap: any = {
        'Необработан': 1,
        'В наличии': 2,
        'Зарезервирован': 3,
        'Удален': 4,
        'Продан': 5
    }
    return statusMap[status] || 1
}

// Получение типа тега для статуса
const getStatusType = (status: string) => {
    const typeMap: any = {
        1: 'warning',
        2: 'success',
        3: 'info',
        4: 'error',
        5: 'default'
    }
    return typeMap[status] || 'default'
}

// Инициализация значения при монтировании
editRef.value = getStatusValue(props.value!)

// Логика сохранения изменений
function onChange() {
    emit('onChangedProp', 'status', {
        value: editRef.value,
        label: getStatusLabel(editRef.value)
    })
    popoverRef.value = false
}
</script>

<style scoped></style>
