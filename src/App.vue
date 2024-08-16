<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <div class="bg-slate-100 min-h-[100vh] grid">
        <Sidebar :class="{
          '!flex': appConfig.isOpenMenu
        }" class="hidden fixed lg:flex z-20"></Sidebar>
        <div class="mt-[20px]" :class="{
          '!ml-[200px]': appConfig.isOpenMenu
        }">
          <div class="max-w-5xl px-3 lg:p-0 mx-auto">
            <router-view></router-view>
          </div>
          <div>
            <Footer class="w-full"></Footer>
          </div>
        </div>
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
import Footer from '@/components/Footer.vue'
import appConfig from '@/stores/app.ts';
import { onMounted } from 'vue';
import { NMessageProvider, NConfigProvider } from 'naive-ui';


const themeOverrides = {
  common: {
    primaryColor: '#FFBF00',
    primaryColorHover: '#FFC800',
    primaryColorPressed: '#E6AC00',
    primaryColorSuppl: '#FFD34D'
  },
}

onMounted(() => {
  if (window.screen.width > 450) {
    appConfig.isOpenMenu = true;
  }
  else {
    appConfig.isOpenMenu = false;
  }
});

</script>