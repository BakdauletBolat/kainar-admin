<template>
  <n-page-header class="mb-4">
    <template #title>
      Запчасти
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
  <main class="grid pb-10">
    <parts-filter></parts-filter>
    <div>
      <n-data-table remote
                    ref="table"
                    :loading="productStore.isLoadingProducts"
                    :columns="columns"
                    :data="productStore.products"
                    :pagination="paginationReactive"
                    :row-key="rowKey"
                    @update:filters="handleFiltersChange"
                    @update:checked-row-keys="handleCheck"
                    @update:sorter="handleSorterChange" />
    </div>
  </main>
</template>
<script setup lang="ts">
import { onMounted, h, reactive, watch } from 'vue';
import { NDataTable, NAvatar, NH6, NTag, NPageHeader, NButton } from 'naive-ui';
import { getFirstElementArray } from '@/utils/getFirstElementFromArray.ts';
import { useRoute, RouterLink, useRouter } from 'vue-router';
import PartsFilter from '@/components/Parts/PartsFilter.vue';
import type { DataTableColumns } from 'naive-ui'
import { useProductStore } from "@/stores/product-store.ts";
import { useFilterStore } from "@/stores/filter-store.ts";
import { formatDate } from '@/utils/formatDate';

interface RowData {
  id: number
  name: string,
  pictures: any[],
  price: number,
  status: string,
  created_at: string,
  category: {
    id: number,
  },
  modelCar: {
    name: string,
    startDate: string
  }
}

const router = useRouter();

function createNavigate() {
  router.push({
    name: 'parts-create'
  })
}

function createColumns(): DataTableColumns<RowData> {
  return [
    {
      type: 'selection',
    },
    {
      title: 'Навзание',
      key: 'name',
      render(row) {
        const image = getFirstElementArray(row.pictures);
        const imageUrl = image ? image.image : undefined
        return h(
          RouterLink,
          {
            class: "gap-3 grid lg:grid-cols-[100px_1fr]",
            to: {
              name: 'parts-detail',
              params: {
                id: row.id
              }
            },
            default: () => row.name
          },
          {
            default: () => [
              h(
                NAvatar,
                {
                  objectFit: 'cover',
                  src: imageUrl,
                  size: 100
                }
              ),
              h('div', {}, [
                h(NH6, {}, {
                  default: () => row.name
                }),
                h('div', {}, [
                  h('div', {}, { default: () => `${row.modelCar.name} ${row.modelCar.startDate}` }),
                  h('div', {}, { default: () => '2001 АКПП LHD ' })
                ])
              ])
            ]
          }
        )
      }
    },
    {
      title: "ID",
      key: "id"
    },
    {
      title: "Дата создание",
      key: "created_at",
      sorter: true,
      render(row) {
        return h('div', {}, { default: () => formatDate(row.created_at) })
      }
    },
    {
      title: "Склад",
      key: "warehouse.name"
    },
    {
      title: "Цена",
      key: "price",
      render(row) {
        return h('div', {
          style: {
            textWrap: 'nowrap'
          }
        }, { default: () => `${row.price}₸` })
      }
    },
    {
      title: "Комментарий",
      key: "comment"
    },
    {
      title: "Статус",
      key: "status",
      render(row) {
        let typeLabel: "success" | "error" = 'success'
        if (row.status == 'Продан') {
          typeLabel = 'error'
        }
        return h(NTag, { type: typeLabel }, { default: () => row.status })
      },
      filter: true,
      filterOptionValues: [],
      filterOptions: [
        {
          label: 'Необработан',
          value: 1
        },
        {
          label: 'В наличии',
          value: 2
        },
        {
          label: 'Зарезервирован',
          value: 3
        },
        {
          label: 'Удален',
          value: 4
        },
        {
          label: 'Продан',
          value: 5
        }
      ]
    }
  ]
}


function handleSorterChange(sorter: any) {
  if (sorter.columnKey == 'created_at') {
    let key = '-created_at'
    if (sorter.order == 'descend') {
      key = 'created_at'
    }
    productStore.loadProducts({...filterStore.filterValues, sort: key})
  }
}


const paginationReactive = reactive({
  page: 1,
  pageSize: 10,
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
    paginationReactive.page = 1;
    onChangedPage(paginationReactive.page);
  }
});

const columns = createColumns();
const route = useRoute();
const productStore = useProductStore();
const filterStore = useFilterStore();

const handleCheck = () => {

}

const rowKey = (row: RowData) => {
  return row.id
}

function handleFiltersChange(filters: any) {
  if (filters?.status != undefined) {
      productStore.loadProducts({ ...filterStore.filterValues, status: filters.status })
  }
}


const onChangedPage = (page: number) => {
  productStore.loadProducts({...filterStore.filterValues, page: page,
    page_size: paginationReactive.pageSize })
}

watch(filterStore.filterValues, (state) => {
  productStore.loadProducts({ ...state, page_size: 10 });
});

onMounted(() => {
  filterStore.clearValues();
  const page = route.query.page != null ? parseInt(route.query.page.toString()) : 1
  productStore.loadProducts({ ...filterStore.filterValues, page: page, page_size: 10 }).then(_ => {
    paginationReactive.itemCount = productStore.productsCount;
  });
});

</script>