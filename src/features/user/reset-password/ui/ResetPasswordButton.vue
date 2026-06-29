<template>
  <n-button
    size="small"
    tertiary
    type="warning"
    round
    :loading="userStore.isLoadingResetPassword"
    @click="confirmReset"
  >
    Сбросить пароль
  </n-button>
</template>

<script setup lang="ts">
import { NButton, useMessage, useDialog } from 'naive-ui';
import { useUserStore } from '@entities/user';
import { extractApiError } from '@/shared/lib/extractApiError';

const props = defineProps<{ phone: string }>();

const userStore = useUserStore();
const message = useMessage();
const dialog = useDialog();

function confirmReset() {
  dialog.warning({
    title: 'Сбросить пароль?',
    content: `Новый пароль будет сгенерирован и отправлен на email сотрудника (${props.phone}).`,
    positiveText: 'Сбросить',
    negativeText: 'Отмена',
    onPositiveClick: async () => {
      try {
        const data = await userStore.resetPassword(props.phone);
        message.success(data?.message ?? 'Новый пароль отправлен на email');
      } catch (e) {
        message.warning(extractApiError(e)[0]);
      }
    },
  });
}
</script>
