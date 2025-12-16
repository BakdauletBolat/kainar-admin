<script setup lang="ts">
import PartsFilter from '@/components/Parts/PartsFilter.vue';
import { onMounted, h, reactive, watch, ref } from 'vue';
import { NDataTable, NAvatar, NH6, NTag, NPageHeader, NButton, NPopconfirm, useMessage, NIcon } from 'naive-ui';
import { getFirstElementArray } from '@/utils/getFirstElementFromArray.ts';
import { useRoute, RouterLink, useRouter } from 'vue-router';
import type { DataTableColumns } from 'naive-ui'
import { useProductStore } from "@/stores/product-store.ts";
import { useFilterStore } from "@/stores/filter-store.ts";
import { formatDate } from '@/utils/formatDate';
import { ImageOutline, ArchiveOutline } from '@vicons/ionicons5';
import axiosIns from '@/apis';

interface RowData {
  id: number
  name: string,
  pictures: any[],
  price: number,
  status: string,
  created_at: string,
  comment?: string,
  warehouse?: {
    name?: string
  },
  category: {
    id: number,
  },
  modelCar: {
    name: string,
    startDate: string,
    manufacturer: {
      name: string
    }
  },
  eav_attributes?: {
    capacity?: string;
    fuelType?: string;
  }
}

const router = useRouter();
const message = useMessage();
const statusFilterValues = ref([]);

const apiBase = (axiosIns.defaults.baseURL || '').replace(/\/$/, '');

function resolveImageUrl(path?: string) {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${apiBase}/${path.replace(/^\//, '')}`;
}

const renderTableEmpty = () =>
  h(
    'div',
    { class: 'flex flex-col items-center justify-center py-10 text-center text-slate-500' },
    [
      h(NIcon, { component: ArchiveOutline, size: 32, class: 'mb-2 text-slate-400' }),
      h('p', { class: 'text-sm font-semibold text-slate-700' }, 'Нет данных'),
      h('p', { class: 'text-xs text-slate-500' }, 'Измените фильтры или сбросьте поиск')
    ]
  );

const rowClassName = () => 'hover:bg-slate-50';

function createNavigate() {
  router.push({
    name: 'parts-create'
  })
}

function formatPrice(price: number | undefined) {
  if (price == null) return '—'
  return `${new Intl.NumberFormat('ru-RU').format(price)} ₸`
}

function getStatusTone(status: string): "success" | "warning" | "info" | "error" | "default" {
  switch (status) {
    case 'В наличии':
      return 'success'
    case 'Зарезервирован':
      return 'warning'
    case 'Продан':
      return 'error'
    case 'Удален':
      return 'default'
    default:
      return 'info'
  }
}

function createColumns(): DataTableColumns<RowData> {
  return [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      title: 'Запчасть',
      key: 'name',
      ellipsis: true,
      width: 420,
      render(row) {
        const image = getFirstElementArray(row.pictures);
        const rawImage =
          typeof image === 'string'
            ? image
            : image?.image || image?.url || image?.image_url || image?.thumbnail;
        const imageUrl = resolveImageUrl(rawImage);
        return h(
            RouterLink,
            {
              class: "flex gap-4 items-center py-2",
              to: {
                name: 'parts-detail',
                params: {
                  id: row.id
                }
              },
            },
            {
              default: () => [
                h(
                  'div',
                  {
                    class: 'overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200',
                    style: {
                      width: '50px',
                      height: '50px',
                      minWidth: '50px',
                      minHeight: '50px'
                    }
                  },
                  imageUrl
                    ? h('img', {
                      src: imageUrl,
                      class: 'h-full w-full object-cover',
                      style: { width: '50px', height: '50px' },
                      onError: (e: any) => { e.target.src = '/car.png' }
                    })
                    : h(
                      'div',
                      {
                        class: 'flex h-full w-full items-center justify-center text-slate-400',
                        style: { width: '50px', height: '50px' }
                      },
                      [h(NIcon, { size: 20, component: ImageOutline })]
                    )
                ),
            h('div', { class: 'flex flex-col gap-1 min-w-0' }, [
              h(NH6, { class: 'text-base font-semibold text-slate-900 mb-0' }, {
                default: () => row.name
              }),
              h('div', { class: 'text-sm text-slate-600 truncate' }, { default: () => `${row.modelCar?.manufacturer?.name ?? '—'} · ${row.modelCar?.name ?? ''} · ${row.modelCar?.startDate ?? ''}` }),
              h('div', { class: 'flex flex-wrap gap-2 text-xs text-slate-500' }, {
                default: () => [
                  h('span', { class: 'inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1' }, `ID ${row.id}`),
                  row?.warehouse?.name
                    ? h('span', { class: 'inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700' }, row.warehouse.name)
                    : null
                  ,
                  row?.eav_attributes?.capacity
                    ? h('span', { class: 'inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-amber-700' }, `Объём ${row.eav_attributes.capacity}`)
                    : null
                ]
              })
            ])
          ]
        }
        )
      }
    },
    {
      title: "Дата создание",
      key: "created_at",
      width: 150,
      sorter: true,
      render(row) {
        return h('div', { class: 'text-sm text-slate-700' }, { default: () => formatDate(row.created_at) })
      }
    },
    {
      title: "Цена",
      key: "price",
      width: 120,
      render(row) {
        return h(
          'div',
          { class: 'flex justify-end' },
          [
            h(
              'span',
              {
                class: 'inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-900'
              },
              formatPrice(row.price)
            )
          ]
        )
      }
    },
    {
      title: "Комментарий",
      key: "comment",
      width: 240,
      ellipsis: {
        tooltip: true
      },
      render(row) {
        return h('div', { class: 'text-sm text-slate-600 max-w-[320px] line-clamp-2' }, { default: () => row.comment || '—' })
      }
    },
    {
      title: "Статус",
      key: "status",
      width: 140,
      render(row) {
        const tone = getStatusTone(row.status)
        return h(
          'div',
          { class: 'flex justify-end' },
          [
            h(
              NTag,
              { round: true, type: tone, bordered: false, class: 'px-3 py-1 text-sm' },
              { default: () => row.status }
            )
          ]
        )
      },
      filter: true,
      defaultFilterOptionValues: [],
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
  itemCount: 0,
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

const checkedRowKeys = ref<number[]>([])

const handleCheck = (keys: number[]) => {
  checkedRowKeys.value = keys
}

const handleDeleteSelected = async () => {
  if (!checkedRowKeys.value.length) return
  try {
    await productStore.bulkDeleteProducts(checkedRowKeys.value);
    checkedRowKeys.value = []
    productStore.loadProducts({ ...filterStore.filterValues, page: paginationReactive.page, page_size: paginationReactive.pageSize })
    message.success('Продукты успешно удалены');
  } catch (e) {
    // Можно добавить обработку ошибок
    message.error("Повторите позднее");
  }
}

const rowKey = (row: RowData) => {
  return row.id
}

function handleFiltersChange(filters: any) {
  if (filters?.status != undefined) {
    statusFilterValues.value = filters.status;
    productStore.loadProducts({ ...filterStore.filterValues, status: filters.status })
  }
}


const onChangedPage = (page: number) => {
  productStore.loadProducts({...filterStore.filterValues, page: page,
    page_size: paginationReactive.pageSize })
}

watch(()=> productStore.productsCount, (state, oldValue)=> {
  if (state != oldValue) {
    paginationReactive.itemCount = state;
  }
})

onMounted(() => {
  filterStore.clearValues();
  const page = route.query.page != null ? parseInt(route.query.page.toString()) : 1
  productStore.loadProducts({ ...filterStore.filterValues, page: page, page_size: 10 }).then((data: any)=>{
    paginationReactive.itemCount = data.count;
  })
});

</script>
<template>
  <section class="space-y-5 pb-10">
    <div class="rounded-3xl border border-slate-200/70 bg-white px-6 py-5 shadow-none">
      <n-page-header class="px-0">
        <template #title>
          Запчасти
        </template>
        <template #subtitle>
          Управление складом и карточками запчастей
        </template>
        <template #extra>
          <div class="flex items-center gap-2">
            <n-button @click="createNavigate" type="primary" round size="large">Создать</n-button>
          </div>
        </template>
      </n-page-header>
    </div>
    <main class="space-y-3">
      <div class="rounded-3xl bg-white px-5 py-4 shadow-none border border-slate-200/70">
        <parts-filter />
      </div>
      <section class="space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 border border-slate-200/60">
          <div class="space-y-1">
            <p class="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Всего</p>
            <p class="text-xl font-semibold text-slate-900">{{ paginationReactive.itemCount }} запчастей</p>
            <p v-if="checkedRowKeys.length" class="text-sm text-slate-500">Выбрано {{ checkedRowKeys.length }} для массовых действий</p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <n-popconfirm
              v-if="checkedRowKeys.length"
              @positive-click="handleDeleteSelected"
              :negative-text="'Отмена'"
              :positive-text="'Удалить'"
            >
              <template #trigger>
                <n-button type="error" secondary round size="medium">
                  Удалить ({{ checkedRowKeys.length }})
                </n-button>
              </template>
              Вы уверены, что хотите удалить выбранные запчасти?
            </n-popconfirm>
            <n-button quaternary round size="medium" @click="productStore.loadProducts({ ...filterStore.filterValues, page: paginationReactive.page, page_size: paginationReactive.pageSize })">
              Обновить
            </n-button>
          </div>
        </div>
        <div class="rounded-3xl border border-slate-200/80 bg-white p-2 shadow-none">
          <n-data-table
            remote
            size="large"
            ref="table"
            :loading="productStore.isLoadingProducts"
            :columns="columns"
            :data="productStore.products"
            :pagination="paginationReactive"
            :row-key="rowKey"
            :checked-row-keys="checkedRowKeys"
            :striped="true"
            :row-class-name="rowClassName"
            :render-empty="renderTableEmpty"
            :bordered="false"
            @update:filters="handleFiltersChange"
            @update:checked-row-keys="handleCheck"
            @update:sorter="handleSorterChange"
          />
        </div>
      </section>
    </main>
  </section>
</template>
