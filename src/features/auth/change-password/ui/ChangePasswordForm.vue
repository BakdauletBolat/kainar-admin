<template>
  <n-form label-placement="top" @submit.prevent="onSubmit">
    <div class="grid gap-4 sm:grid-cols-2">
      <n-form-item
        label="Текущий пароль"
        :validation-status="oldError ? 'error' : undefined"
        :feedback="oldError || undefined"
      >
        <n-input
          v-model:value="form.old_password"
          type="password"
          show-password-on="click"
          placeholder="Введите текущий пароль"
          @input="oldError = ''"
        />
      </n-form-item>

      <div class="hidden sm:block" />

      <n-form-item
        label="Новый пароль"
        :validation-status="newError ? 'error' : undefined"
        :feedback="newError || undefined"
      >
        <n-input
          v-model:value="form.new_password"
          type="password"
          show-password-on="click"
          placeholder="Введите новый пароль"
          @input="newError = ''"
        />
      </n-form-item>

      <n-form-item
        label="Повторите новый пароль"
        :validation-status="repeatError ? 'error' : undefined"
        :feedback="repeatError || undefined"
      >
        <n-input
          v-model:value="repeatPassword"
          type="password"
          show-password-on="click"
          placeholder="Повторите новый пароль"
          @input="repeatError = ''"
        />
      </n-form-item>
    </div>

    <div class="flex justify-end mt-2">
      <n-button
        type="primary"
        round
        size="large"
        class="font-medium"
        :disabled="userStore.isLoadingChangePassword"
        :loading="userStore.isLoadingChangePassword"
        @click="onSubmit"
      >
        Изменить пароль
      </n-button>
    </div>
  </n-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { NForm, NFormItem, NInput, NButton, useMessage } from 'naive-ui';
import { useUserStore } from '@entities/user';
import { extractApiError } from '@/shared/lib/extractApiError';

const userStore = useUserStore();
const message = useMessage();

const form = reactive({
  old_password: '',
  new_password: '',
});
const repeatPassword = ref('');

const oldError = ref('');
const newError = ref('');
const repeatError = ref('');

async function onSubmit() {
  oldError.value = '';
  newError.value = '';
  repeatError.value = '';

  if (!form.old_password) {
    oldError.value = 'Введите текущий пароль';
    return;
  }
  if (!form.new_password) {
    newError.value = 'Введите новый пароль';
    return;
  }
  if (form.new_password !== repeatPassword.value) {
    repeatError.value = 'Пароли не совпадают';
    return;
  }

  try {
    await userStore.changePassword(form.old_password, form.new_password);
    message.success('Пароль успешно изменён');
    form.old_password = '';
    form.new_password = '';
    repeatPassword.value = '';
  } catch (e) {
    const raw = (e as any)?.response?.data?.error;
    if (Array.isArray(raw)) {
      newError.value = raw.map((m: unknown) => String(m)).join(' ');
    } else if (typeof raw === 'string') {
      oldError.value = raw;
    } else {
      message.error(extractApiError(e)[0]);
    }
  }
}
</script>
