<template>
  <main class="w-full grid">
    <n-page-header class="mb-4">
      <template #title>
        Склады
      </template>
      <template #subtitle>
        {{ paginationReactive.itemCount }}
      </template>
      <template #extra>
        <div>
          <n-button @click="createNavigate" type="primary" round>Создать</n-button>
        </div>
      </template>
    </n-page-header>
    <div class="grid">
      <div class="flex gap-2 py-3">
        <n-input placeholder="Найти" v-model:value="searchRef"></n-input>
        <n-button @click="searchResults">Найти</n-button>
      </div>
      <n-data-table remote :loading="warehouseStore.isLoading" ref="table" :columns="columns"
        :data="warehouseStore.warehouses" :pagination="paginationReactive" :row-key="rowKey"
        @update:checked-row-keys="handleCheck" />
    </div>
  </main>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, h } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { type DataTableColumns, NButton, NDataTable, NEllipsis, NPageHeader, NInput } from "naive-ui";
import { useWarehouseStore } from '@/stores/warehouses-store';

interface RowData {
  id: number
  name: string,
  categories: {
    id: number;
    name: string;
    parent: number;
    updated_at: Date
  }[]
}

const warehouseStore = useWarehouseStore();

const router = useRouter();
const route = useRoute();
const searchRef = ref();
const columns = createColumns();

const rowKey = (row: RowData) => {
  return row.id
}

const handleCheck = () => {

}

function createColumns(): DataTableColumns<RowData> {
  return [{
    type: 'selection'
  },
  {
    title: "ID",
    key: "id",
    render(row) {
      return h(RouterLink, {
        to: {
          name: 'warehouses-detail',
          params: {
            id: row.id
          }
        }
      }, {
        default: () => row.id
      })
    }
  },
  {
    title: "Название",
    key: "name"
  },
  {
    title: "Категория деталей",
    key: "category",
    render(row) {
      return h(NEllipsis, { style: 'max-width: 240px' }, {
        default: () => {
          return row.categories.map(c => c.name).join(', ')
        }
      })
    }
  }]
}


const paginationReactive = reactive({
  page: 1,
  pageSize: 50,
  showSizePicker: true,
  itemCount: 168,
  pageSizes: [5, 10, 25, 50, 100],
  prefix({ itemCount }: any) {
    return `Всего ${itemCount} запчастей`
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
    page_size: paginationReactive.pageSize
  })
}

onMounted(() => {
  const page = route.query.page != undefined ? parseInt(route.query.page.toString()) : 1
  warehouseStore.loadWarehouses({ page: page, page_size: paginationReactive.pageSize }).then((_) => {
    paginationReactive.itemCount = warehouseStore.itemCount
  })
});

function createNavigate() {
  router.push({
    name: 'warehouses-create'
  })
}

function searchResults() {
  warehouseStore.loadWarehouses({
    search: searchRef.value,
    page_size: paginationReactive.pageSize
  })
}

</script>