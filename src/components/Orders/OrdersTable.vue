<template>
  <n-page-header class="mb-4">
    <template #title>
      {{ title }}
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
      <n-data-table remote :loading="isLoading"
                    ref="table" :columns="columns"
                    :data="ordersData"
                    :pagination="paginationReactive"
                    :row-key="rowKey"/>
    </div>
  </main>
</template>
<script setup lang="ts">
import {onMounted, h, reactive, watch, computed} from 'vue';
import {NDataTable, NAvatar, NH6, NTag, NPageHeader, NButton} from 'naive-ui';
import {getFirstElementArray} from '@/utils/getFirstElementFromArray.ts';
import {useRoute, RouterLink, useRouter} from 'vue-router';
import type {DataTableColumns} from 'naive-ui'
import {useFilterStore} from "@/stores/filter-store.ts";
import {useOrderStore} from "@/stores/order-store.ts";
import {Order} from "@/apis/domain";
import {rand} from '@vueuse/core';
import {timeAgo} from "@/utils/formatDate.ts";

interface Props {
  title: string;
  statusFilter?: number | null;
}

const props = withDefaults(defineProps<Props>(), {
  statusFilter: null
});

const orderStore = useOrderStore();

// Вычисляемые свойства для определения какое состояние использовать
const isLoading = computed(() => {
  return props.statusFilter === 1 ? orderStore.isLoadingOrdersInProgress : orderStore.isLoadingOrders;
});

const ordersData = computed(() => {
  return props.statusFilter === 1 ? orderStore.ordersInProgress : orderStore.orders;
});

const loadOrdersMethod = props.statusFilter === 1 ? orderStore.loadOrdersInProgress : orderStore.loadOrders;

const router = useRouter();

function createNavigate() {
  router.push({
    name: 'orders-create'
  })
}

function createColumns(): DataTableColumns<Order> {
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
              class: "gap-2 grid lg:grid-cols-[70px_1fr]",
              to: {
                name: 'orders-detail',
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
                      size: 70
                    }
                ),
                h('div', {}, [
                  h(NH6, {
                    class: "!mb-2"
                  }, {
                    default: () => row.goods[0].product.name
                  }),
                  h('div', {}, {
                    default: () => `${row.goods.length} штук (${row.total}KZT)`
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
      title: "Клиент",
      key: "first_name"
    },
    {
      title: "Склад",
      key: "warehouse.name"
    },
    {
      title: "Дата обновление",
      key: "updated_at",
      render(row) {
        return h('div', {}, {default: () => `${timeAgo(new Date(row.updated_at))}`})
      }
    },
    {
      title: "Цена",
      key: "price",
      render(row) {
        return h('div', {}, {default: () => `${row.total ?? 0} ₸`})
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
        let typeLabel: any = 'success';
        if (row.status == 'Отменен') {
          typeLabel = 'error'
        }
        if (row.status == 'В процессе') {
          typeLabel = 'warning'
        }
        return h(NTag, {type: typeLabel}, {default: () => row.status})
      }
    },
    {
      title: "Статус оплаты",
      key: "payment_status",
      render(row) {
        let typeLabel: any = 'success'
        if (row.payment_status == 'Отклонен') {
          typeLabel = 'error'
        }
        if (row.payment_status == 'В ожидании') {
          typeLabel = 'warning'
        }
        return h(NTag, {type: typeLabel}, {default: () => row.payment_status})
      }
    }
  ]
}


const paginationReactive = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  itemCount: 0,
  pageSizes: [5, 10, 25, 50, 100],
  prefix({itemCount}: any) {
    return `Всего ${itemCount} заказов`
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
const filterStore = useFilterStore();


const rowKey = (row: Order) => {
  return row.id + `${rand(1, 10000)}`
}

const onChangedPage = (page: number) => {
  const filterOrder: any = {page: page, page_size: paginationReactive.pageSize}

  if (props.statusFilter !== null) {
    filterOrder.status = props.statusFilter;
  }

  loadOrdersMethod(filterOrder).then(res => {
    //@ts-ignore
    paginationReactive.itemCount = res.count;
  })
}

watch(filterStore.filterValues, (state) => {
  loadOrdersMethod(state).then(res => {
    //@ts-ignore
    paginationReactive.itemCount = res.count;
  });
});

function loadOrders() {
  const page = route.query.page != null ? parseInt(route.query.page.toString()) : 1
  const filterOrder: any = {page: page, page_size: 10}

  if (props.statusFilter !== null) {
    filterOrder.status = props.statusFilter;
  }

  loadOrdersMethod(filterOrder).then(res => {
    //@ts-ignore
    paginationReactive.itemCount = res.count;
  })
}

onMounted(() => {
  loadOrders()
});

</script>
