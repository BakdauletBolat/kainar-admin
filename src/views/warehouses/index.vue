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
      <n-data-table
          remote :loading="isLoading" ref="table"
          :columns="columns" :data="items" :pagination="paginationReactive"
          :row-key="rowKey" @update:checked-row-keys="handleCheck"/>
    </div>
  </main>
</template>
<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue';
import axios from '@/apis/index.ts';
import {useRoute, useRouter} from 'vue-router';
import {h} from 'vue';
import {type DataTableColumns, NButton, NDataTable, NEllipsis, NPageHeader} from "naive-ui";

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

const router = useRouter();
const items = ref<any[]>([]);
const isLoading = ref(false);

const route = useRoute();

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
      key: "id"
    },
    {
      title: "Название",
      key: "name"
    },
    {
      title: "Категория деталей",
      key: "category",
      render(row) {
        return h(NEllipsis, {style: 'max-width: 240px'}, {default: ()=>{
          return row.categories.map(c=>c.name).join(', ')
          }})
      }
    }]
}

const getWarehouses = (page: number) => {
  isLoading.value = true;
  axios.get(`/api/stock/warehouses/?page=${page}&page_size=${paginationReactive.pageSize}`).then((response) => {
    items.value = response.data.results;
    paginationReactive.itemCount = response.data.count
  }).finally(() => {
    isLoading.value = false;
  });
}

const paginationReactive = reactive({
  page: 1,
  pageSize: 50,
  showSizePicker: true,
  itemCount: 168,
  pageSizes: [5, 10, 25, 50, 100],
  prefix({itemCount}: any) {
    return `Всего ${itemCount} запчастей`
  },
  onChange: (page: number) => {
    paginationReactive.page = page
    onChangedPage(page);
  },
  onUpdatePageSize: (pageSize: number) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
  }
});

const onChangedPage = (page: number) => {
  getWarehouses(page);
}

onMounted(() => {
  const page = route.query.page != undefined ? parseInt(route.query.page.toString()) : 1
  getWarehouses(page);
});

function createNavigate() {
  router.push({
    name: 'warehouses-create'
  })
}

</script>