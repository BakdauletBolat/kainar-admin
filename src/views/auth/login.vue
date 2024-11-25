<template>
  <div class="min-h-screen w-full flex justify-center items-center">
    <n-form ref="formRef"
            :rules="rules"
            :model="formValue" class="flex flex-col min-w-[360px]">
      <div class="text-2xl  mb-4">Войти в аккаунт</div>
      <n-form-item label="Номер телефона" path="phone">
        <n-input v-model:value="formValue.phone"
                 class="masked-elem"
                 placeholder="+7 (___) ___-__-__"></n-input>
      </n-form-item>
      <n-form-item label="Пароль" path="password">
        <n-input type="password" v-model:value="formValue.password"
                 placeholder="Пароль"></n-input>
      </n-form-item>
        <n-button type="primary" :loading="authStore.isLoading" @click="onClickLogin">Авторизоваться</n-button>
    </n-form>
  </div>
</template>
<script lang="ts" setup>
import {NForm, NInput, NButton, NFormItem, useMessage} from 'naive-ui';
import {onMounted, ref} from 'vue';
import IMask from "imask";
import {useAuthStore} from "@/stores/auth-store.ts";
import {useRoute, useRouter} from "vue-router";

const formRef = ref<HTMLFormElement>();
const formValue = ref({
  phone: "",
  password: ""
})

const authStore = useAuthStore();
const message = useMessage();
const route = useRoute();
const router = useRouter();

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
      }
    }
    else {
      console.log(errors);
      message.error("Введите все поля")
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