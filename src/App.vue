<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-layout has-sider>
        <n-layout-sider bordered class="!hidden md:!block h-screen !z-[99] !fixed" collapse-mode="width"
          :collapsed-width="64" :width="240" :collapsed="collapsed" show-trigger @collapse="collapsed = true"
          @expand="collapsed = false">
          <div class="flex justify-center p-3 gap-3 items-center">
            <Avatar class="h-[40px]" :url="Logo"></Avatar>
            <div :class="{
              'hidden': collapsed
            }" class="text-2xl">Управление</div>
          </div>
          <n-menu :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions"
            :expand-icon="expandIcon" />
        </n-layout-sider>
        <n-layout>
          <div class="flex">
            <div class="w-[64px] h-full"></div>
            <div class="container mx-auto px-4 mb-[120px] mt-4">
              <router-view></router-view>
            </div>
          </div>

          <BottomAppBar class="md:hidden"></BottomAppBar>
        </n-layout>
      </n-layout>
    </n-message-provider>
  </n-config-provider>
</template>
<script setup lang="ts">
import { NMessageProvider, NConfigProvider, NLayout, NMenu, NLayoutSider, NIcon } from 'naive-ui';
import { Component, h, ref } from 'vue'
import type { MenuOption } from 'naive-ui'

//@ts-ignore
import { CaretDownOutline } from '@vicons/ionicons5';

import {CogIcon, ShoppingCartIcon, InboxIcon, UsersIcon, UserIcon, ShoppingBagIcon} from '@heroicons/vue/24/outline';
import { RouterLink } from "vue-router";
import Logo from "@/assets/new-logo.png";
import Avatar from "@/components/Avatar.vue";
import BottomAppBar from './components/BottomAppBar.vue';

const themeOverrides = {
  common: {
    primaryColor: '#FFBF00',
    primaryColorHover: '#FFC800',
    primaryColorPressed: '#E6AC00',
    primaryColorSuppl: '#FFD34D'
  },
}

const collapsed = ref(true);


function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

function expandIcon() {
  return h(NIcon, null, { default: () => h(CaretDownOutline) })
}

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'parts-list',
          }
        },
        { default: () => 'Запчасти' }
      ),
    key: 'parts-list',
    icon: renderIcon(CogIcon)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'orders-list'
          },
        },
        { default: () => 'Заказы' }
      ),
    key: 'orders-list',
    icon: renderIcon(ShoppingCartIcon)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'orders-list-in-progress'
          },
        },
        { default: () => 'Заказы в процессе' }
      ),
    key: 'orders-list-in-progress',
    icon: renderIcon(ShoppingBagIcon)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'warehouses-list'
          },
        },
        { default: () => 'Склады' }
      ),
    key: 'warehouses-list',
    icon: renderIcon(InboxIcon)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'clients-list'
          },
        },
        { default: () => 'Клиенты' }
      ),
    key: 'clients-list',
    icon: renderIcon(UsersIcon)
  },
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                name: 'profile'
              },
            },
            { default: () => 'Профиль' }
        ),
    key: 'profile',
    icon: renderIcon(UserIcon)
  },
]

</script>