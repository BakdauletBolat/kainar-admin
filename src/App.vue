<template>
  <div class="bg-slate-100 min-h-[100vh] grid lg:grid-cols-[250px_1fr]">
    <div>
      <Sidebar :class="{
        '!flex': appConfig.isOpenMenu
      }" class="hidden lg:flex z-20"></Sidebar>
    </div>
    <div class="mt-[73px]">
      <div class="max-w-5xl px-3 lg:p-0 mx-auto">
        <router-view></router-view>
      </div>
    <div>
      <Footer class="w-full"></Footer>
    </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
import Footer from '@/components/Footer.vue'
import appConfig from '@/stores/app.ts'; 
</script>