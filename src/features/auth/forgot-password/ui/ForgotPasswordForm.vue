<template>
  <n-form
    ref="formRef"
    :model="formValue"
    :rules="rules"
    label-placement="top"
    class="space-y-4"
    @submit.prevent="onSubmit"
  >
    <p class="text-sm text-slate-600">
      Укажите номер телефона — новый пароль придёт на email сотрудника.
    </p>
    <n-form-item label="Номер телефона" path="phone">
      <n-input
        v-model:value="formValue.phone"
        class="masked-forgot"
        placeholder="+7 (___) ___-__-__"
      />
    </n-form-item>
    <div class="flex justify-end gap-2">
      <n-button
        type="primary"
        :loading="userStore.isLoadingForgotPassword"
        @click="onSubmit"
      >
        Сбросить пароль
      </n-button>
    </div>
  </n-form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { NForm, NFormItem, NInput, NButton, useMessage } from 'naive-ui';
import IMask from 'imask';
import { useUserStore } from '@entities/user';
import { extractApiError } from '@/shared/lib/extractApiError';

const emit = defineEmits<{ (e: 'success'): void }>();

const userStore = useUserStore();
const message = useMessage();

const formRef = ref<any>();
const formValue = ref({ phone: '' });

const rules = {
  phone: {
    required: true,
    message: 'Введите номер телефона',
    trigger: ['input', 'blur'],
  },
};

const maskOptions = {
  mask: '+{7} (000) 000 00 00',
};

let mask: any = null;

async function onSubmit() {
  formRef.value?.validate(async (errors: any) => {
    if (errors) {
      message.error('Введите номер телефона');
      return;
    }
    const digits = (mask?.unmaskedValue || formValue.value.phone).replace(/\D/g, '');
    if (digits.length < 11) {
      message.error('Введите номер телефона полностью');
      return;
    }
    const phone = '+' + digits;
    try {
      const data = await userStore.forgotPassword(phone);
      message.success(data?.message ?? 'Новый пароль отправлен на email');
      emit('success');
    } catch (e) {
      message.error(extractApiError(e)[0]);
    }
  });
}

onMounted(() => {
  const maskedElem = document.querySelector('.masked-forgot')?.querySelector('input');
  if (maskedElem) {
    mask = IMask(maskedElem, maskOptions);
  }
});
</script>
