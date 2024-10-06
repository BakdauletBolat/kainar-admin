<template>
    <div v-if="!isVisible" @click="isVisible = true">
        {{ price ?? '-' }}
    </div>
    <div v-if="isVisible">
        <n-input class="!min-w-min !w-auto" placeholder="Поменять цену" v-model:value="priceRef"></n-input>
        <n-button-group>
            <n-button @click="onChange" type="primary">Сохранить</n-button>
            <n-button @click="isVisible = false">Отменить</n-button>
        </n-button-group>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { NInput, NButtonGroup, NButton } from 'naive-ui';

const props = defineProps(['price'])
const emit = defineEmits(['onChangedProp'])
const isVisible = ref<boolean>(false);
const priceRef = ref<string>('0');

onMounted(() => {
    priceRef.value = props.price;
})

function onChange() {
    emit('onChangedProp', 'price', priceRef.value)
}

</script>