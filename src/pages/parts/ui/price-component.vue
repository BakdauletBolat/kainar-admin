<template>
    <div>
        <!-- Выпадающее меню для редактирования цены -->
        <n-popover v-model:show="popoverRef" trigger="click" placement="bottom">
            <template #trigger>
                <div class="cursor-pointer">
                    <TengeAmount :value="price"></TengeAmount>
                </div>
            </template>
            <n-card>
                <n-input class="!min-w-min !w-auto" placeholder="Поменять цену" v-model:value="priceRef"></n-input>
                <n-space justify="end" class="mt-4">
                    <n-button @click="onChange" type="primary">Сохранить</n-button>
                </n-space>
            </n-card>
        </n-popover>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { NInput, NSpace, NCard, NPopover, NButton } from 'naive-ui';
import TengeAmount from '@/shared/ui/TengeAmount.vue';

const props = defineProps(['price'])
const emit = defineEmits(['onChangedProp'])
const priceRef = ref<string>('0');
const popoverRef = ref<boolean>(false);

onMounted(() => {
    priceRef.value = props.price;
})

function onChange() {
    emit('onChangedProp', 'price', priceRef.value);
    popoverRef.value = false;
}

</script>

<style scoped></style>
