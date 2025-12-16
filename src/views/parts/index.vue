<script setup lang="ts">
import PartsFilter from '@/components/Parts/PartsFilter.vue';
import { onMounted, h, reactive, watch, ref } from 'vue';
import { NDataTable, NAvatar, NH6, NTag, NButton, NPopconfirm, useMessage, NIcon } from 'naive-ui';
import { getFirstElementArray } from '@/utils/getFirstElementFromArray.ts';
import { useRoute, RouterLink, useRouter } from 'vue-router';
import type { DataTableColumns } from 'naive-ui'
import { useProductStore } from "@/stores/product-store.ts";
import { useFilterStore } from "@/stores/filter-store.ts";
import { formatDate } from '@/utils/formatDate';
import { PlusIcon, TrashIcon, SparklesIcon } from '@heroicons/vue/24/outline';
import TengeAmount from '@/components/TengeAmount.vue';

interface RowData {
  id: number
  name: string,
  pictures: any[],
  price: number,
  status: string,
  created_at: string,
  comment?: string,
  category: {
    id: number,
  },
  warehouse?: {
    name: string
  },
  modelCar: {
    name: string,
    startDate: string,
    manufacturer: {
      name: string
    }
  }
}

const router = useRouter();
const message = useMessage();
function createNavigate() {
  router.push({
    name: 'parts-create'
  })
}

function createColumns(): DataTableColumns<RowData> {
  return [
    {
      type: 'selection',
      width: 56
    },
    {
      title: 'Запчасть',
      key: 'product',
      render(row) {
        const image = getFirstElementArray(row.pictures);
        const imageUrl = image ? image.image : undefined
        return h(
            RouterLink,
            {
              class: "grid gap-3 lg:grid-cols-[92px_1fr]",
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
                      size: 92,
                      class: "!rounded-2xl ring-1 ring-slate-200"
                    }
                ),
                h('div', {}, [
                  h(NH6, {}, {
                    default: () => row.name
                  }),
                  h('div', { class: "text-slate-600 text-sm" }, [
                    h('div', {}, { default: () => `${row.modelCar.manufacturer.name} ${row.modelCar.name}` }),
                    h('div', {}, { default: () => `Старт: ${row.modelCar.startDate}` })
                  ]),
                  h('div', { class: "text-xs text-slate-500 mt-1" }, { default: () => `#${row.id}` })
                ])
              ]
            }
        )
      }
    },
    {
      title: "Склад / Цена",
      key: "created_at",
      sorter: true,
      render(row) {
        return h('div', { class: "space-y-1" }, {
          default: () => [
            h('div', { class: "text-sm text-slate-700" }, { default: () => row.warehouse?.name ?? 'Склад не указан' }),
            h('div', { class: "text-base font-semibold text-slate-900" }, {
              default: () => h(TengeAmount, { value: row.price })
            }),
            h('div', { class: "text-xs text-slate-500" }, { default: () => formatDate(row.created_at) })
          ]
        })
      }
    },
    {
      title: "Статус",
      key: "status",
      render(row) {
        const typeLabel = statusType(row.status);
        return h('div', { class: "flex flex-col gap-1" }, {
          default: () => [
            h(NTag, { type: typeLabel, round: true, size: "small" }, { default: () => row.status }),
            row.comment ? h('div', { class: "text-xs text-slate-500" }, { default: () => row.comment }) : null
          ]
        })
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
    productStore.loadProducts({ ...filterStore.filterValues, status: filters.status })
  }
}

function statusType(status: string): "success" | "warning" | "error" | "default" {
  if (status === 'В наличии') return 'success';
  if (status === 'Зарезервирован' || status === 'Необработан') return 'warning';
  if (status === 'Продан' || status === 'Удален') return 'error';
  return 'default';
}

function rowClassName() {
  return 'apple-row';
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
  <main class="space-y-5 pb-8">
    <section
      class="relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-6 md:p-7 backdrop-blur-2xl shadow-[0_18px_60px_rgba(15,23,42,0.12)]">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute -top-8 left-12 h-28 w-28 rounded-full bg-[#dbeafe] blur-3xl"></div>
        <div class="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-[#ffe8b5] blur-3xl opacity-80"></div>
      </div>
      <div class="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="space-y-2">
          <div
            class="inline-flex items-center gap-2 rounded-full bg-slate-900/5 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-900/10">
            <SparklesIcon class="h-4 w-4 text-amber-500" />
            <span>Каталог запчастей</span>
          </div>
          <div class="space-y-1">
            <h1 class="text-2xl md:text-3xl font-semibold text-slate-900 leading-tight">Запчасти</h1>
            <p class="text-sm text-slate-600">Управляйте запасами, статусами и ценами в одном месте.</p>
          </div>
          <div class="flex items-center gap-3 text-sm text-slate-600">
            <n-tag round size="small" type="info">Всего: {{ paginationReactive.itemCount }}</n-tag>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <n-button quaternary round @click="productStore.loadProducts({ ...filterStore.filterValues, page: paginationReactive.page, page_size: paginationReactive.pageSize })">
            Обновить
          </n-button>
          <n-button type="primary" strong round @click="createNavigate">
            <template #icon>
              <n-icon>
                <PlusIcon />
              </n-icon>
            </template>
            Создать
          </n-button>
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <div
        class="rounded-3xl border border-white/70 bg-white/80 p-5 md:p-6 backdrop-blur-2xl shadow-[0_16px_50px_rgba(15,23,42,0.1)]">
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.08em] text-slate-500">Фильтры</p>
            <h2 class="text-lg font-semibold text-slate-900">Уточните список</h2>
          </div>
          <div v-if="checkedRowKeys.length" class="flex items-center gap-2">
            <n-popconfirm @positive-click="handleDeleteSelected" negative-text="Отмена" positive-text="Удалить">
              <template #trigger>
                <n-button type="error" quaternary>
                  <template #icon>
                    <n-icon>
                      <TrashIcon />
                    </n-icon>
                  </template>
                  Удалить ({{ checkedRowKeys.length }})
                </n-button>
              </template>
              Вы уверены, что хотите удалить выбранные запчасти?
            </n-popconfirm>
          </div>
        </div>
        <div class="mt-4">
          <parts-filter></parts-filter>
        </div>
      </div>

      <div
        class="rounded-3xl border border-white/70 bg-white/80 p-5 md:p-6 backdrop-blur-2xl shadow-[0_16px_50px_rgba(15,23,42,0.1)]">
        <div class="flex items-center justify-between mb-3">
          <div>
            <p class="text-xs uppercase tracking-[0.08em] text-slate-500">Список</p>
            <h2 class="text-lg font-semibold text-slate-900">Таблица запчастей</h2>
          </div>
          <n-tag round size="small" type="success">активно</n-tag>
        </div>
        <n-data-table
          remote
          ref="table"
          class="apple-table"
          :loading="productStore.isLoadingProducts"
          :columns="columns"
          :data="productStore.products"
          :pagination="paginationReactive"
          :row-key="rowKey"
          :checked-row-keys="checkedRowKeys"
          :row-class-name="rowClassName"
          @update:filters="handleFiltersChange"
          @update:checked-row-keys="handleCheck"
          @update:sorter="handleSorterChange"
        />
      </div>
    </section>
  </main>
</template>

<style scoped>
:global(.apple-table .n-data-table-th) {
  padding: 16px 18px;
  background: #f1f5f9;
  font-weight: 600;
  color: #0f172a;
  border-bottom: 1px solid #e2e8f0;
}

:global(.apple-table .n-data-table-td) {
  padding: 16px 18px;
  color: #0f172a;
  background: white;
  border-bottom: 1px solid #f1f5f9;
}

:global(.apple-row .n-data-table-td:first-child) {
  border-top-left-radius: 18px;
  border-bottom-left-radius: 18px;
}

:global(.apple-row .n-data-table-td:last-child) {
  border-top-right-radius: 18px;
  border-bottom-right-radius: 18px;
}

:global(.apple-table .n-data-table-tr:hover .n-data-table-td) {
  background: #f8fafc;
}

:global(.apple-table .n-data-table-td__content) {
  line-height: 1.5;
}

:global(.apple-table .n-data-table-table) {
  border-radius: 24px;
  overflow: hidden;
  background: transparent;
}

:global(.apple-table .n-data-table-tr) {
  background: transparent;
}
</style>
