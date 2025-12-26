<template>
  <section class="space-y-3">
    <div class="rounded-3xl border border-slate-200/80 bg-white px-6 py-5 shadow-sm">
      <n-page-header class="px-0">
        <template #title>
          <span class="text-2xl font-semibold text-slate-900">{{ title }}</span>
        </template>
        <template #subtitle>
          <span class="text-sm text-slate-600">{{ subtitle }}</span>
        </template>
        <template #extra>
          <div class="flex items-center gap-2">
            <n-button type="primary" round size="large" class="font-medium" @click="createNavigate">
              Создать
            </n-button>
          </div>
        </template>
      </n-page-header>
    </div>

    <div
      class="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white px-5 py-4 border border-slate-200/80 shadow-sm"
    >
      <div class="space-y-1.5">
        <p class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Всего</p>
        <p class="text-2xl font-bold text-slate-900">
          {{ paginationReactive.itemCount.toLocaleString('ru-RU') }}
        </p>
        <p v-if="checkedRowKeys.length" class="text-sm font-medium text-slate-600">
          Выбрано {{ checkedRowKeys.length }}
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <n-button
          quaternary
          round
          size="medium"
          class="font-medium"
          :loading="isLoading"
          @click="handleRefresh"
        >
          Обновить
        </n-button>
      </div>
    </div>

    <div class="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <n-data-table
          remote
          size="large"
          ref="table"
          style="min-width: 1100px"
          :loading="isLoading"
          :columns="columns"
          :data="ordersData"
          :pagination="paginationReactive"
          :row-key="rowKey"
          :checked-row-keys="checkedRowKeys"
          :striped="false"
          :row-class-name="rowClassName"
          :render-empty="renderTableEmpty"
          :bordered="false"
          :scroll-x="1200"
          @update:checked-row-keys="handleCheck"
          @update:sorter="handleSorterChange"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, h, onMounted, reactive, ref, watch } from 'vue';
import { NButton, NDataTable, NIcon, NPageHeader, NTag, type DataTableColumns } from 'naive-ui';
import { ArchiveOutline, ImageOutline } from '@vicons/ionicons5';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import axiosIns from '@/shared/api/axios';
import { getFirstElementArray } from '@/shared/lib/getFirstElementFromArray';
import { formatDate } from '@/shared/lib/formatDate';
import { useOrderStore } from '@/modules/orders/stores/order.store';
import type { Order } from '@/modules/orders/types';

interface Props {
  title: string;
  subtitle?: string;
  statusFilter?: number | null;
}

const props = withDefaults(defineProps<Props>(), {
  subtitle: 'Управление заказами и статусами клиентов',
  statusFilter: null
});

const router = useRouter();
const route = useRoute();
const orderStore = useOrderStore();

const apiBase = (axiosIns.defaults.baseURL || '').replace(/\/$/, '');
const checkedRowKeys = ref<number[]>([]);
const currentSort = ref<string | null>(null);

const isLoading = computed(() =>
  props.statusFilter === 1 ? orderStore.isLoadingOrdersInProgress : orderStore.isLoadingOrders
);

const ordersData = computed(() =>
  props.statusFilter === 1 ? orderStore.ordersInProgress : orderStore.orders
);

const renderTableEmpty = () =>
  h(
    'div',
    { class: 'flex flex-col items-center justify-center py-10 text-center text-slate-500' },
    [
      h(NIcon, { component: ArchiveOutline, size: 32, class: 'mb-2 text-slate-400' }),
      h('p', { class: 'text-sm font-semibold text-slate-700' }, 'Нет данных'),
      h('p', { class: 'text-xs text-slate-500' }, 'Измените фильтры или обновите список')
    ]
  );

const rowClassName = () => 'hover:bg-slate-50 transition-colors duration-150';

const paginationReactive = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  itemCount: 0,
  pageSizes: [10, 25, 50, 100],
  showQuickJumper: true,
  prefix({ itemCount }: any) {
    return `${itemCount.toLocaleString('ru-RU')} заказов`;
  },
  onChange: (page: number) => {
    paginationReactive.page = page;
    loadOrders(page);
  },
  onUpdatePageSize: (pageSize: number) => {
    paginationReactive.pageSize = pageSize;
    paginationReactive.page = 1;
    loadOrders(1);
  }
});

const loadOrdersMethod =
  props.statusFilter === 1 ? orderStore.loadOrdersInProgress : orderStore.loadOrders;

function resolveImageUrl(path?: string) {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${apiBase}/${path.replace(/^\//, '')}`;
}

function createNavigate() {
  router.push({ name: 'orders-create' });
}

function getOrderStatusTone(status: string): 'success' | 'warning' | 'info' | 'error' | 'default' {
  switch (status) {
    case 'Завершен':
      return 'success';
    case 'В процессе':
      return 'warning';
    case 'Отменен':
      return 'error';
    default:
      return 'info';
  }
}

function getPaymentStatusTone(
  status: string
): 'success' | 'warning' | 'info' | 'error' | 'default' {
  switch (status) {
    case 'Оплачен':
      return 'success';
    case 'В ожидании':
      return 'warning';
    case 'Отклонен':
      return 'error';
    default:
      return 'default';
  }
}

function formatPrice(value: string | number | null | undefined) {
  if (value == null) return '—';
  const numericValue = typeof value === 'number' ? value : parseFloat(value);
  if (Number.isNaN(numericValue)) return '—';
  return `${new Intl.NumberFormat('ru-RU').format(numericValue)} ₸`;
}

function createColumns(): DataTableColumns<Order> {
  return [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      title: 'Заказ',
      key: 'name',
      ellipsis: true,
      width: 420,
      minWidth: 380,
      render(row) {
        const firstGood = row.goods?.[0];
        const image = getFirstElementArray(firstGood?.product?.pictures);
        const rawImage =
          typeof image === 'string'
            ? image
            : image?.image || image?.url || image?.image_url || image?.thumbnail;
        const imageUrl = resolveImageUrl(rawImage);
        const productName = firstGood?.product?.name || 'Товар';

        return h(
          RouterLink,
          {
            class: 'flex gap-3 items-center py-1.5',
            to: { name: 'orders-detail', params: { id: row.id } }
          },
          {
            default: () => [
              h(
                'div',
                {
                  class: 'overflow-hidden rounded-lg bg-slate-50 ring-1 ring-slate-200/60',
                  style: {
                    width: '48px',
                    height: '48px',
                    minWidth: '48px',
                    minHeight: '48px'
                  }
                },
                imageUrl
                  ? h('img', {
                      src: imageUrl,
                      class: 'h-full w-full object-cover',
                      style: { width: '48px', height: '48px' },
                      onError: (e: any) => {
                        e.target.src = '/car.png';
                      }
                    })
                  : h(
                      'div',
                      {
                        class: 'flex h-full w-full items-center justify-center text-slate-300',
                        style: { width: '48px', height: '48px' }
                      },
                      [h(NIcon, { size: 18, component: ImageOutline })]
                    )
              ),
              h('div', { class: 'flex flex-col gap-1.5 min-w-0 py-0.5' }, [
                h('div', { class: 'text-sm font-semibold text-slate-900 leading-tight' }, productName),
                h(
                  'div',
                  { class: 'text-xs text-slate-600 truncate leading-tight' },
                  `${row.goods?.length || 0} позиций · ${row.first_name || row.client || 'Клиент'}`
                ),
                h('div', { class: 'flex flex-wrap gap-1.5 text-xs text-slate-500 mt-0.5' }, [
                  h(
                    'span',
                    { class: 'inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-medium' },
                    `ID ${row.id}`
                  ),
                  row?.warehouse?.name
                    ? h(
                        'span',
                        {
                          class:
                            'inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-indigo-700 font-medium'
                        },
                        row.warehouse.name
                      )
                    : null,
                  row.delivery_type
                    ? h(
                        'span',
                        {
                          class:
                            'inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-amber-700 font-medium'
                        },
                        row.delivery_type
                      )
                    : null
                ])
              ])
            ]
          }
        );
      }
    },
    {
      title: 'Клиент',
      key: 'first_name',
      width: 180,
      minWidth: 160,
      ellipsis: { tooltip: true },
      render(row) {
        return h('div', { class: 'flex flex-col gap-1 min-w-0' }, [
          h('div', { class: 'text-sm font-medium text-slate-900 leading-tight truncate' }, [
            row.first_name || '—'
          ]),
          h(
            'div',
            { class: 'text-xs text-slate-500 leading-tight truncate' },
            row.phone_number || row.email || 'Контакты не указаны'
          )
        ]);
      }
    },
    {
      title: 'Статус оплаты',
      key: 'payment_status',
      width: 160,
      minWidth: 140,
      align: 'center',
      render(row) {
        const tone = getPaymentStatusTone(row.payment_status);
        return h('div', { class: 'flex justify-center' }, [
          h(
            NTag,
            { round: true, type: tone, bordered: false, class: 'px-3 py-1 text-xs font-semibold' },
            { default: () => row.payment_status }
          )
        ]);
      }
    },
    {
      title: 'Статус',
      key: 'status',
      width: 150,
      minWidth: 130,
      align: 'center',
      render(row) {
        const tone = getOrderStatusTone(row.status);
        return h('div', { class: 'flex justify-center' }, [
          h(
            NTag,
            { round: true, type: tone, bordered: false, class: 'px-3 py-1 text-xs font-semibold' },
            { default: () => row.status }
          )
        ]);
      }
    },
    {
      title: 'Сумма',
      key: 'total',
      width: 140,
      minWidth: 120,
      align: 'right',
      render(row) {
        return h('div', { class: 'flex justify-end' }, [
          h(
            'span',
            {
              class:
                'inline-flex items-center rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white'
            },
            formatPrice(row.total)
          )
        ]);
      }
    },
    {
      title: 'Создан',
      key: 'created_at',
      width: 150,
      minWidth: 130,
      sorter: true,
      render(row) {
        return h(
          'div',
          { class: 'text-sm text-slate-600 font-medium' },
          formatDate(row.created_at)
        );
      }
    },
    {
      title: 'Комментарий',
      key: 'comment',
      width: 240,
      ellipsis: { tooltip: true },
      render(row) {
        return h(
          'div',
          { class: 'text-sm text-slate-500 max-w-[320px] line-clamp-2 leading-relaxed' },
          row.comment || '—'
        );
      }
    }
  ];
}

const columns = createColumns();

const rowKey = (row: Order) => row.id;

function handleCheck(keys: number[]) {
  checkedRowKeys.value = keys;
}

function buildBaseParams(page: number) {
  const params: Record<string, any> = {
    page,
    page_size: paginationReactive.pageSize
  };

  if (props.statusFilter !== null) {
    params.status = props.statusFilter;
  }

  if (currentSort.value) {
    params.sort = currentSort.value;
  }

  return params;
}

function loadOrders(page = paginationReactive.page, extraParams: Record<string, any> = {}) {
  const params = { ...buildBaseParams(page), ...extraParams };
  return loadOrdersMethod(params).then((res: any) => {
    paginationReactive.itemCount = res.count ?? 0;
    return res;
  });
}

function handleRefresh() {
  loadOrders(paginationReactive.page);
}

function handleSorterChange(sorter: any) {
  if (sorter?.columnKey === 'created_at') {
    if (!sorter.order) {
      currentSort.value = null;
      loadOrders(paginationReactive.page);
      return;
    }

    currentSort.value = sorter.order === 'descend' ? 'created_at' : '-created_at';
    loadOrders(paginationReactive.page);
  }
}

watch(
  () => props.statusFilter,
  () => {
    paginationReactive.page = 1;
    loadOrders(1);
  }
);

onMounted(() => {
  const page = route.query.page != null ? parseInt(route.query.page.toString()) : 1;
  paginationReactive.page = Number.isNaN(page) ? 1 : page;
  loadOrders(paginationReactive.page);
});
</script>
