<template>
  <div>
    <div class="mb-3">Привет, {{authStore.user?.first_name}}!</div>
    <n-button @click="logout">Выйти из аккаунта</n-button>
  </div>
</template>
<script lang="ts" setup>
import {onMounted} from "vue";
import {useAuthStore} from "@/stores/auth-store.ts";
import {NButton} from 'naive-ui';
import {useRouter} from "vue-router";

const authStore = useAuthStore();

const router = useRouter();

async function logout() {
  await authStore.logout();
  await router.push("/login");
}

onMounted(()=>{
  authStore.userMe();
})
</script>