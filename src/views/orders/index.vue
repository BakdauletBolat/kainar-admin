<template>
  <n-page-header class="mb-4">
    <template #title>
      Заказы
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
  <main class="grid">
    <div>
      <n-data-table remote :loading="orderStore.isLoadingOrders" ref="table" :columns="columns"
        :data="orderStore.orders" :pagination="paginationReactive" :row-key="rowKey"
        @update:checked-row-keys="handleCheck" />
    </div>
  </main>
</template>
<script setup lang="ts">
import { onMounted, h, reactive, watch } from 'vue';
import { NDataTable, NAvatar, NH6, NTag, NPageHeader, NButton } from 'naive-ui';
import { getFirstElementArray } from '@/utils/getFirstElementFromArray.ts';
import { useRoute, RouterLink, useRouter } from 'vue-router';
import type { DataTableColumns } from 'naive-ui'
import { useFilterStore } from "@/stores/filter-store.ts";
import { useOrderStore } from "@/stores/order-store.ts";

interface RowData {
  id: number
  name: string,
  goods: {
    product: {
      name: string
      pictures: []
    }
  }[]
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
    name: 'orders-create'
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
        const image = getFirstElementArray(row.goods[0].product.pictures);
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
            default: () => row.id
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
                  default: () => row.goods[0].product.name
                })
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
      title: "Склад",
      key: "warehouse.name"
    },
    {
      title: "Цена",
      key: "price",
      render(row) {
        return h('div', {}, { default: () => `${row.price ?? 0} ₸` })
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
      }
    }
  ]
}


const paginationReactive = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  itemCount: 168,
  pageSizes: [5, 10, 25, 50, 100],
  prefix({ itemCount }: any) {
    return `Всего ${itemCount} заказов`
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

const columns = createColumns();
const route = useRoute();
const orderStore = useOrderStore();
const filterStore = useFilterStore();

const handleCheck = () => {

}

const rowKey = (row: RowData) => {
  return row.id
}

const onChangedPage = (page: number) => {
  orderStore.loadOrders({ page: page })
}

watch(filterStore.filterValues, (state) => {
  orderStore.loadOrders(state);
});

onMounted(() => {
  const page = route.query.page != undefined ? parseInt(route.query.page.toString()) : 1
  orderStore.loadOrders({ page: page })
});

</script>