<template>
    <div>
        <!-- Выпадающее меню для редактирования цены -->
        <n-popover v-model:show="popoverRef" trigger="click" placement="bottom">
            <template #trigger>
                <div class="cursor-pointer">
                    <div>
                        {{ code != undefined && code.length > 0 ? code!.join(', ') : '-' }}
                    </div>
                </div>
            </template>
            <n-card>
                <n-dynamic-input v-model:value="editRef" placeholder="Добавьте код" />
                <n-space justify="end" class="mt-4">
                    <n-button @click="onChange" type="primary">Сохранить</n-button>
                </n-space>
            </n-card>
        </n-popover>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { NDynamicInput, NSpace, NCard, NPopover, NButton } from 'naive-ui';

const props = defineProps<{
    code?: number[]
}>();

const emit = defineEmits(['onChangedProp'])
const editRef = ref();
const popoverRef = ref<boolean>(false);

onMounted(() => {
    editRef.value = props.code
})

function onChange() {
    console.log(editRef.value)
    emit('onChangedProp', 'code', editRef.value);
    popoverRef.value = false;
}


</script>