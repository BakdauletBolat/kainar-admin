<template>
  <div class="space-y-4">
    <h3 class="text-sm font-semibold text-slate-900">Адрес доставки</h3>
    <n-input
      v-model:value="address"
      type="textarea"
      placeholder="Введите адрес доставки"
      :rows="3"
      @update:value="handleAddressChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NInput } from 'naive-ui';

const address = ref('');
const emit = defineEmits<{
  'update:address': [value: string];
}>();

const handleAddressChange = (value: string) => {
  emit('update:address', value);
};
</script>
