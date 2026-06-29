<template>
  <div class="min-h-screen w-full flex justify-center items-center px-4">
    <div class="w-full max-w-[420px] rounded-3xl border border-slate-200/80 bg-white px-8 py-8 shadow-sm">
    <n-form ref="formRef"
            :rules="rules"
            :model="formValue" class="flex flex-col">
      <div class="text-2xl font-semibold text-slate-900 mb-4">Войти в аккаунт</div>
      <n-form-item label="Номер телефона" path="phone">
        <n-input v-model:value="formValue.phone"
                 class="masked-elem"
                 placeholder="+7 (___) ___-__-__"></n-input>
      </n-form-item>
      <n-form-item label="Пароль" path="password">
        <n-input type="password"
                 @keyup.enter="onClickLogin"
                 v-model:value="formValue.password"
                 placeholder="Пароль"></n-input>
      </n-form-item>
        <n-button type="primary" :loading="authStore.isLoading" @click="onClickLogin">Авторизоваться</n-button>
        <div class="mt-4 text-center">
          <button
            type="button"
            class="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 hover:underline"
            @click="showForgot = true"
          >
            Забыли пароль?
          </button>
        </div>
    </n-form>
    </div>

    <n-modal v-model:show="showForgot" transform-origin="center">
      <n-card
        style="width: 420px"
        :bordered="false"
        title="Сброс пароля"
        role="dialog"
        aria-modal="true"
      >
        <ForgotPasswordForm @success="showForgot = false" />
      </n-card>
    </n-modal>
  </div>
</template>
<script lang="ts" setup>
import {NForm, NInput, NButton, NFormItem, NModal, NCard, useMessage} from 'naive-ui';
import {onMounted, ref} from 'vue';
import IMask from "imask";
import {useUserStore as useAuthStore} from "@entities/user";
import {useRoute, useRouter} from "vue-router";
import { ForgotPasswordForm } from "@features/auth/forgot-password";

const formRef = ref<HTMLFormElement>();
const formValue = ref({
  phone: "",
  password: ""
})

const authStore = useAuthStore();
const message = useMessage();
const route = useRoute();
const router = useRouter();

const showForgot = ref(false);

const maskOptions = {
  mask: "+{7} (000) 000 00 00",
};

const rules = {
  phone: {
    required: true,
    message: "Авторизация обязательно",
    trigger: ["input", "blur"]
  },
  password: {
    required: true,
    message: "Пароль обязательно",
    trigger: ["input", "blur"]
  }
}

let mask = null;

async function onClickLogin() {
  formRef.value?.validate(async (errors: any) => {
    if (!errors) {
      try {
        formValue.value.phone = "+" + mask!.unmaskedValue;
        const redirectUrl = route.query.redirectUrl ?? "/";
        await authStore.authUser(formValue.value);
        await router.push(redirectUrl.toString());
      }
      catch (error) {
        let messageText = "Что то не так";

        //@ts-ignore
        if (error?.message != undefined) {
          //@ts-ignore
          messageText = error.message;
        }

        //@ts-ignore
        if (error?.response?.data?.message != undefined) {
          //@ts-ignore
          messageText = error.response!.data!.message;
        }
        message.error(messageText)
        throw error;
      }
    }
    else {
      message.error("Введите все поля");
    }
  })

}

onMounted(() => {
  const maskedElem = document.querySelector(".masked-elem")?.querySelector("input");
  if (maskedElem) {
    mask = IMask(maskedElem, maskOptions);
  }
});

</script>