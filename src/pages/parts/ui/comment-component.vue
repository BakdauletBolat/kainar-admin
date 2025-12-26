<template>
    <div>
        <!-- Выпадающее меню для редактирования цены -->
        <n-popover v-model:show="popoverRef" trigger="click" placement="bottom">
            <template #trigger>
                <div class="cursor-pointer">
                    {{ value ?? '-' }}
                </div>
            </template>
            <n-card>
                <n-input class="!min-w-min !w-auto" placeholder="Поменять коментари" v-model:value="editRef"></n-input>
                <n-space justify="end" class="mt-4">
                    <n-button @click="onChange" type="primary">Сохранить</n-button>
                    <!-- <n-button @click="onCancel">Отменить</n-button> -->
                </n-space>
            </n-card>
        </n-popover>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { NInput, NSpace, NCard, NPopover, NButton } from 'naive-ui';

const props = defineProps(['value'])
const emit = defineEmits(['onChangedProp'])
const editRef = ref<string>('0');
const popoverRef = ref<boolean>(false);

onMounted(() => {
    editRef.value = props.value;
})

function onChange() {
    emit('onChangedProp', 'comment', editRef.value);
    popoverRef.value = false;
}

</script>

<style scoped></style>