<template>
  <n-layout-sider
    bordered
    collapse-mode="width"
    :collapsed-width="64"
    :width="240"
    :collapsed="collapsed"
    show-trigger
    @collapse="collapsed = true"
    @expand="collapsed = false"
  >
    <n-menu
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
      :value="activeKey"
      @update:value="handleMenuSelect"
    />
  </n-layout-sider>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NLayoutSider, NMenu, NIcon } from 'naive-ui'
import {
  HomeOutline,
  CubeOutline,
  CartOutline,
  StorefrontOutline,
  PeopleOutline,
  ChatboxOutline,
  CarOutline,
  ColorPaletteOutline,
  GridOutline
} from '@vicons/ionicons5'
import type { MenuOption } from 'naive-ui'

const router = useRouter()
const route = useRoute()

const collapsed = ref(false)

const activeKey = computed(() => {
  return route.name as string
})

const menuOptions: MenuOption[] = [
  {
    label: 'Главная',
    key: 'home',
    icon: () => h(NIcon, null, { default: () => h(HomeOutline) })
  },
  {
    label: 'Запчасти',
    key: 'parts',
    icon: () => h(NIcon, null, { default: () => h(CubeOutline) })
  },
  {
    label: 'Заказы',
    key: 'orders',
    icon: () => h(NIcon, null, { default: () => h(CartOutline) })
  },
  {
    label: 'Склады',
    key: 'warehouses',
    icon: () => h(NIcon, null, { default: () => h(StorefrontOutline) })
  },
  {
    label: 'Клиенты',
    key: 'clients',
    icon: () => h(NIcon, null, { default: () => h(PeopleOutline) })
  },
  {
    label: 'Обратная связь',
    key: 'feedbacks',
    icon: () => h(NIcon, null, { default: () => h(ChatboxOutline) })
  },
  {
    label: 'Категории',
    key: 'categories',
    icon: () => h(NIcon, null, { default: () => h(GridOutline) })
  },
  {
    label: 'Производители',
    key: 'manufacturers',
    icon: () => h(NIcon, null, { default: () => h(CarOutline) })
  },
  {
    label: 'Цвета',
    key: 'colors',
    icon: () => h(NIcon, null, { default: () => h(ColorPaletteOutline) })
  }
]

function handleMenuSelect(key: string) {
  router.push({ name: key })
}
</script>
