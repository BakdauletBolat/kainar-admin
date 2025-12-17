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
        <span class="text-slate-900 font-medium">Клиенты</span>
      </n-breadcrumb-item>
    </n-breadcrumb>

    <!-- Header Card -->
    <div class="rounded-3xl border border-slate-200/80 bg-white px-6 py-5 shadow-sm">
      <n-page-header class="px-0">
        <template #title>
          <span class="text-2xl font-semibold text-slate-900">Клиенты</span>
        </template>
        <template #subtitle>
          <span class="text-sm text-slate-600">Управление клиентской базой</span>
        </template>
        <template #extra>
          <div class="flex items-center gap-2">
            <n-input
              v-model:value="searchPhone"
              placeholder="Поиск по номеру телефона"
              clearable
              class="w-72"
              round
            />
            <router-link :to="{ name: 'clients-create' }">
              <n-button type="primary" round size="large" class="font-medium">
                Создать
              </n-button>
            </router-link>
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
            :loading="clientStore.isLoadingClients"
            :columns="columns"
            :data="clientStore.clients"
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
import { ref, watch, onMounted, h, reactive } from 'vue';
import { NDataTable, NPageHeader, NInput, NButton, NBreadcrumb, NBreadcrumbItem, NIcon } from 'naive-ui';
import { useRoute, RouterLink } from 'vue-router';
import type { DataTableColumns } from 'naive-ui'
import { formatDate } from '@/utils/formatDate';
import { useClientStore, Client } from "@/stores/client-store.ts";
import { ArchiveOutline, PersonOutline } from '@vicons/ionicons5';

const renderTableEmpty = () =>
  h('div', {
    class: 'flex flex-col items-center justify-center py-10 text-center text-slate-500'
  }, [
    h(NIcon, { component: ArchiveOutline, size: 32, class: 'mb-2 text-slate-400' }),
    h('p', { class: 'text-sm font-semibold text-slate-700' }, 'Нет клиентов'),
    h('p', { class: 'text-xs text-slate-500' }, 'Измените фильтры или создайте первого клиента')
  ])

const rowClassName = () => 'hover:bg-slate-50 transition-colors duration-150';

function createColumns(): DataTableColumns<Client> {
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
        return h(
          RouterLink,
          {
            class: "text-sm font-semibold text-slate-900 hover:text-primary-600 transition-colors",
            to: {
              name: 'clients-detail',
              params: { id: row.id }
            },
          },
          { default: () => `#${row.id}` }
        )
      }
    },
    {
      title: 'Клиент',
      key: 'last_name',
      width: 300,
      render(row) {
        return h(
          RouterLink,
          {
            class: "flex gap-3 items-center py-1.5",
            to: {
              name: 'clients-detail',
              params: { id: row.id }
            },
          },
          {
            default: () => [
              // Аватар с инициалами
              h('div', {
                class: 'flex items-center justify-center w-10 h-10 rounded-full bg-primary-500 text-white text-sm font-semibold',
              }, getInitials(row)),

              // Информация о клиенте
              h('div', { class: 'flex flex-col gap-1 min-w-0' }, [
                h('div', { class: 'text-sm font-semibold text-slate-900 leading-tight' },
                  `${row.first_name} ${row.last_name}`
                ),
                h('div', { class: 'text-xs text-slate-500' }, row.phone || '—')
              ])
            ]
          }
        )
      }
    },
    {
      title: "Email",
      key: "email",
      width: 220,
      ellipsis: {
        tooltip: true
      },
      render(row) {
        return h('div', { class: 'text-sm text-slate-600' }, row.email || '—')
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
      title: "Дата регистрации",
      key: "date_joined",
      width: 150,
      sorter: true,
      render(row) {
        return h('div', { class: 'text-sm text-slate-600 font-medium' }, formatDate(row.date_joined))
      }
    },
    {
      title: "Роль",
      key: "roles",
      width: 120,
      render(row) {
        const role = row.roles?.[0]?.name
        if (!role) {
          return h('span', { class: 'text-sm text-slate-400' }, '—')
        }
        return h('span', {
          class: 'inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700'
        }, role)
      }
    }
  ]
}

function getInitials(client: Client): string {
  const first = client.first_name?.[0] || ''
  const last = client.last_name?.[0] || ''
  return (first + last).toUpperCase() || '?'
}

const paginationReactive = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  itemCount: 0,
  pageSizes: [10, 25, 50, 100],
  showQuickJumper: true,
  prefix({ itemCount }: any) {
    return `${itemCount.toLocaleString('ru-RU')} клиентов`
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

const columns = createColumns();
const route = useRoute();
const clientStore = useClientStore();

const rowKey = (row: Client) => {
  return row.id
}

const onChangedPage = (page: number) => {
  clientStore.loadClients({
    page: page,
    page_size: paginationReactive.pageSize,
    phone: searchPhone.value
  }).then(_ => {
    paginationReactive.itemCount = clientStore.clientsCount;
  })
}

const refreshData = () => {
  onChangedPage(paginationReactive.page)
}

onMounted(() => {
  const page = route.query.page != null ? parseInt(route.query.page.toString()) : 1
  clientStore.loadClients({ page: page, page_size: 10 }).then(_ => {
    paginationReactive.itemCount = clientStore.clientsCount;
  });
});

const searchPhone = ref('');
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

watch(searchPhone, (val) => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    paginationReactive.page = 1;
    clientStore.loadClients({
      page: 1,
      page_size: paginationReactive.pageSize,
      phone: val
    }).then(_ => {
      paginationReactive.itemCount = clientStore.clientsCount;
    });
  }, 500);
});
</script>
