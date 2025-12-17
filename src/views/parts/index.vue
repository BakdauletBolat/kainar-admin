<script setup lang="ts">
import PartsFilter from '@/components/Parts/PartsFilter.vue';
import { onMounted, h, reactive, watch, ref } from 'vue';
import { NDataTable, NAvatar, NH6, NTag, NPageHeader, NButton, NPopconfirm, useMessage, NIcon, NBreadcrumb, NBreadcrumbItem } from 'naive-ui';
import { getFirstElementArray } from '@/utils/getFirstElementFromArray.ts';
import { useRoute, RouterLink, useRouter } from 'vue-router';
import type { DataTableColumns } from 'naive-ui'
import { useProductStore } from "@/stores/product-store.ts";
import { useFilterStore } from "@/stores/filter-store.ts";
import { formatDate } from '@/utils/formatDate';
import { ImageOutline, ArchiveOutline } from '@vicons/ionicons5';
import axiosIns from '@/apis';
import { getStatusType } from '@/styles/design-tokens';

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

const rowClassName = () => 'hover:bg-slate-50 transition-colors duration-150';

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
  return getStatusType(status)
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
      minWidth: 360,
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
              class: "flex gap-3 items-center py-1.5",
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
                      onError: (e: any) => { e.target.src = '/car.png' }
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
              h('div', { class: 'text-sm font-semibold text-slate-900 leading-tight' }, {
                default: () => row.name
              }),
              h('div', { class: 'text-xs text-slate-600 truncate leading-tight' }, { default: () => `${row.modelCar?.manufacturer?.name ?? '—'} · ${row.modelCar?.name ?? ''} · ${row.modelCar?.startDate ?? ''}` }),
              h('div', { class: 'flex flex-wrap gap-1.5 text-xs text-slate-500 mt-0.5' }, {
                default: () => [
                  h('span', { class: 'inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-medium' }, `ID ${row.id}`),
                  row?.warehouse?.name
                    ? h('span', { class: 'inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-indigo-700 font-medium' }, row.warehouse.name)
                    : null
                  ,
                  row?.eav_attributes?.capacity
                    ? h('span', { class: 'inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-amber-700 font-medium' }, `Объём ${row.eav_attributes.capacity}`)
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
      minWidth: 130,
      sorter: true,
      render(row) {
        return h('div', { class: 'text-sm text-slate-600 font-medium' }, { default: () => formatDate(row.created_at) })
      }
    },
    {
      title: "Цена",
      key: "price",
      width: 130,
      minWidth: 120,
      align: 'right',
      render(row) {
        return h(
          'div',
          { class: 'flex justify-end' },
          [
            h(
              'span',
              {
                class: 'inline-flex items-center rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white'
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
      minWidth: 200,
      ellipsis: {
        tooltip: true
      },
      render(row) {
        return h('div', { class: 'text-sm text-slate-500 max-w-[320px] line-clamp-2 leading-relaxed' }, { default: () => row.comment || '—' })
      }
    },
    {
      title: "Статус",
      key: "status",
      width: 150,
      minWidth: 130,
      align: 'center',
      render(row) {
        const tone = getStatusTone(row.status)
        return h(
          'div',
          { class: 'flex justify-center' },
          [
            h(
              NTag,
              { round: true, type: tone, bordered: false, class: 'px-3 py-1 text-xs font-semibold' },
              { default: () => row.status }
            )
          ]
        )
      }
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
  pageSizes: [10, 25, 50, 100],
  showQuickJumper: true,
  prefix({ itemCount }: any) {
    return `${itemCount.toLocaleString('ru-RU')} записей`
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
  <section class="space-y-4 pb-10">
    <!-- Breadcrumbs -->
    <n-breadcrumb class="mb-2">
      <n-breadcrumb-item>
        <router-link to="/" class="text-slate-600 hover:text-slate-900 transition-colors">
          Главная
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        <span class="text-slate-900 font-medium">Запчасти</span>
      </n-breadcrumb-item>
    </n-breadcrumb>

    <div class="rounded-3xl border border-slate-200/80 bg-white px-6 py-5 shadow-sm">
      <n-page-header class="px-0">
        <template #title>
          <span class="text-2xl font-semibold text-slate-900">Запчасти</span>
        </template>
        <template #subtitle>
          <span class="text-sm text-slate-600">Управление складом и карточками запчастей</span>
        </template>
        <template #extra>
          <div class="flex items-center gap-2">
            <n-button @click="createNavigate" type="primary" round size="large" class="font-medium">Создать</n-button>
          </div>
        </template>
      </n-page-header>
    </div>
    <main class="space-y-3">
      <div class="rounded-3xl bg-white px-5 py-4 shadow-none border border-slate-200/70">
        <parts-filter />
      </div>
      <section class="space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white px-5 py-4 border border-slate-200/80 shadow-sm">
          <div class="space-y-1.5">
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Всего</p>
            <p class="text-2xl font-bold text-slate-900">{{ paginationReactive.itemCount.toLocaleString('ru-RU') }}</p>
            <p v-if="checkedRowKeys.length" class="text-sm font-medium text-slate-600">Выбрано {{ checkedRowKeys.length }}</p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <n-popconfirm
              v-if="checkedRowKeys.length"
              @positive-click="handleDeleteSelected"
              :negative-text="'Отмена'"
              :positive-text="'Удалить'"
            >
              <template #trigger>
                <n-button type="error" secondary round size="medium" class="font-medium">
                  Удалить ({{ checkedRowKeys.length }})
                </n-button>
              </template>
              Вы уверены, что хотите удалить выбранные запчасти?
            </n-popconfirm>
            <n-button quaternary round size="medium" @click="productStore.loadProducts({ ...filterStore.filterValues, page: paginationReactive.page, page_size: paginationReactive.pageSize })" class="font-medium">
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
              :loading="productStore.isLoadingProducts"
              :columns="columns"
              :data="productStore.products"
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
    </main>
  </section>
</template>
