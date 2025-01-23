<template>
  <n-page-header class="mb-4">
    <template #title>
      Клиенты
    </template>
    <template #subtitle>
      {{ paginationReactive.itemCount }}
    </template>
    <template #extra>

    </template>
  </n-page-header>
  <main class="grid pb-10">
    <div>
      <n-data-table remote :loading="clientStore.isLoadingClients" ref="table" :columns="columns"
                    :data="clientStore.clients" :pagination="paginationReactive" :row-key="rowKey" />
    </div>
  </main>
</template>
<script setup lang="ts">
import { onMounted, h, reactive } from 'vue';
import { NDataTable, NPageHeader } from 'naive-ui';
import { useRoute, RouterLink } from 'vue-router';
import type { DataTableColumns } from 'naive-ui'
import { formatDate } from '@/utils/formatDate';
import {useClientStore, Client} from "@/stores/client-store.ts";


function createColumns(): DataTableColumns<Client> {
  return [
    {
      type: 'selection',
    },
    {
      title: "ID",
      key: "id",
    },
    {
      title: 'Навзание',
      key: 'last_name',
      render(row) {
        return h(
            RouterLink,
            {
              to: {
                name: 'clients-detail',
                params: {
                  id: row.id
                }
              },
            },
            {
              default: () => `${row.first_name} ${row.last_name}`
            }
        )
      }
    },
    {
      title: "Дата присоединение",
      key: "data_joined",
      render(row) {
        return h('div', {}, { default: () => formatDate(row.date_joined) })
      }
    },
    {
      title: "Телефон",
      key: "phone"
    }
  ]
}



const paginationReactive = reactive({
  page: 1,
  pageSize: 25,
  showSizePicker: true,
  itemCount: 0,
  pageSizes: [5, 10, 25, 50, 100],
  prefix({ itemCount }: any) {
    return `Всего ${itemCount} клиентов`
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
  clientStore.loadClients({page: page, page_size: paginationReactive.pageSize })
}


onMounted(() => {
  const page = route.query.page != null ? parseInt(route.query.page.toString()) : 1
  clientStore.loadClients({page: page, page_size: 25 }).then(_ => {
    paginationReactive.itemCount =clientStore.clientsCount;
  });
});

</script>