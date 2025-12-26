<template>
  <section class="space-y-4 pb-10">
    <!-- Breadcrumbs -->
    <n-breadcrumb class="mb-2">
      <n-breadcrumb-item>
        <router-link to="/" class="text-slate-600 hover:text-slate-900 transition-colors">
          Главная
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        <span class="text-slate-900 font-medium">Склады</span>
      </n-breadcrumb-item>
    </n-breadcrumb>

    <!-- Header Card -->
    <div class="rounded-3xl border border-slate-200/80 bg-white px-6 py-5 shadow-sm">
      <n-page-header class="px-0">
        <template #title>
          <span class="text-2xl font-semibold text-slate-900">Склады</span>
        </template>
        <template #subtitle>
          <span class="text-sm text-slate-600">Управление складами и запасами</span>
        </template>
        <template #extra>
          <div class="flex items-center gap-2">
            <n-input
              v-model:value="searchRef"
              placeholder="Поиск по названию"
              clearable
              class="w-72"
              round
              @keyup.enter="searchResults"
            />
            <n-button @click="createNavigate" type="primary" round size="large" class="font-medium">
              Создать
            </n-button>
          </div>
        </template>
      </n-page-header>
    </div>

    <main class="space-y-3">
      <section class="space-y-3">
        <!-- Статистика -->
        <div class="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white px-5 py-4 border border-slate-200/80 shadow-sm">
          <div class="space-y-1.5">
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Всего</p>
            <p class="text-2xl font-bold text-slate-900">{{ paginationReactive.itemCount.toLocaleString('ru-RU') }}</p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <n-button quaternary round size="medium" @click="refreshData" class="font-medium">
              Обновить
            </n-button>
          </div>
        </div>

        <!-- Таблица -->
        <div class="rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
          <n-data-table
            remote
            size="large"
            ref="table"
            :loading="warehouseStore.isLoading"
            :columns="columns"
            :data="warehouseStore.warehouses"
            :pagination="paginationReactive"
            :row-key="rowKey"
            :striped="false"
            :row-class-name="rowClassName"
            :render-empty="renderTableEmpty"
            :bordered="false"
          />
        </div>
      </section>
    </main>
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, h } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { type DataTableColumns, NButton, NDataTable, NPageHeader, NInput, NBreadcrumb, NBreadcrumbItem, NIcon } from "naive-ui";
import { useWarehouseStore } from '@entities/warehouse';
import { ArchiveOutline, BusinessOutline } from '@vicons/ionicons5';

interface RowData {
  id: number
  name: string,
  city?: {
    id: number;
    name: string;
  }
  categories: {
    id: number;
    name: string;
    parent: number;
    updated_at: Date
  }[]
  min_stock_level?: number
}

const renderTableEmpty = () =>
  h('div', {
    class: 'flex flex-col items-center justify-center py-10 text-center text-slate-500'
  }, [
    h(NIcon, { component: ArchiveOutline, size: 32, class: 'mb-2 text-slate-400' }),
    h('p', { class: 'text-sm font-semibold text-slate-700' }, 'Нет складов'),
    h('p', { class: 'text-xs text-slate-500' }, 'Создайте первый склад')
  ])

const rowClassName = () => 'hover:bg-slate-50 transition-colors duration-150';

const warehouseStore = useWarehouseStore();

const router = useRouter();
const route = useRoute();
const searchRef = ref('');

const rowKey = (row: RowData) => {
  return row.id
}

function createColumns(): DataTableColumns<RowData> {
  return [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      title: "ID",
      key: "id",
      width: 80,
      render(row) {
        return h(RouterLink, {
          class: "text-sm font-semibold text-slate-900 hover:text-primary-600 transition-colors",
          to: {
            name: 'warehouses-detail',
            params: { id: row.id }
          }
        }, {
          default: () => `#${row.id}`
        })
      }
    },
    {
      title: "Склад",
      key: "name",
      width: 280,
      render(row) {
        return h(
          RouterLink,
          {
            class: "flex gap-3 items-center py-1.5",
            to: {
              name: 'warehouses-detail',
              params: { id: row.id }
            },
          },
          {
            default: () => [
              // Иконка склада
              h('div', {
                class: 'flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600',
              }, h(NIcon, { component: BusinessOutline, size: 20 })),

              // Информация о складе
              h('div', { class: 'flex flex-col gap-1 min-w-0' }, [
                h('div', { class: 'text-sm font-semibold text-slate-900 leading-tight' }, row.name),
                h('div', { class: 'text-xs text-slate-500' }, row.city?.name || '—')
              ])
            ]
          }
        )
      }
    },
    {
      title: "Город",
      key: "city",
      width: 150,
      render(row) {
        if (!row.city?.name) {
          return h('span', { class: 'text-sm text-slate-400' }, '—')
        }
        return h('span', {
          class: 'inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700'
        }, row.city.name)
      }
    },
    {
      title: "Категории деталей",
      key: "categories",
      render(row) {
        if (!row.categories.length) {
          return h('span', { class: 'text-sm text-slate-400' }, '—')
        }
        return h('div', { class: 'flex flex-wrap gap-1.5' },
          row.categories.slice(0, 3).map(cat =>
            h('span', {
              class: 'inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700'
            }, cat.name)
          ).concat(
            row.categories.length > 3
              ? h('span', {
                class: 'inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600'
              }, `+${row.categories.length - 3}`)
              : []
          )
        )
      }
    },
    {
      title: "Мин. уровень",
      key: "min_stock_level",
      width: 140,
      align: 'right',
      render(row) {
        if (!row.min_stock_level) {
          return h('span', { class: 'text-sm text-slate-400' }, '—')
        }
        return h('span', {
          class: 'inline-flex items-center rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white'
        }, row.min_stock_level.toLocaleString('ru-RU'))
      }
    }
  ]
}

const columns = createColumns();

const paginationReactive = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  itemCount: 0,
  pageSizes: [10, 25, 50, 100],
  showQuickJumper: true,
  prefix({ itemCount }: any) {
    return `${itemCount.toLocaleString('ru-RU')} складов`
  },
  onChange: (page: number) => {
    paginationReactive.page = page
    onChangedPage(page);
  },
  onUpdatePageSize: (pageSize: number) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
    onChangedPage(paginationReactive.page);
  }
});

const onChangedPage = (page: number) => {
  warehouseStore.loadWarehouses({
    page: page,
    page_size: paginationReactive.pageSize,
    search: searchRef.value
  }).then(_ => {
    paginationReactive.itemCount = warehouseStore.itemCount
  })
}

const refreshData = () => {
  onChangedPage(paginationReactive.page)
}

onMounted(() => {
  const page = route.query.page != null ? parseInt(route.query.page.toString()) : 1
  warehouseStore.loadWarehouses({ page: page, page_size: 10 }).then((_) => {
    paginationReactive.itemCount = warehouseStore.itemCount
  })
});

function createNavigate() {
  router.push({
    name: 'warehouses-create'
  })
}

function searchResults() {
  paginationReactive.page = 1
  onChangedPage(1)
}
</script>
