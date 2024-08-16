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
  <main class="grid">
    <PartsFilter @update="updateFromFilter"></PartsFilter>
    <div class="overflow-scroll">
      <n-data-table
          remote
          :loading="isLoading"
          @update:filters="handleFiltersChange"
          ref="table" :columns="columns" :data="items" :pagination="paginationReactive"
          :row-key="rowKey" @update:checked-row-keys="handleCheck"/>
    </div>
  </main>
</template>
<script setup lang="ts">
import {onMounted, ref, h, reactive} from 'vue';
import {NDataTable, NAvatar, NH6, NTag, NPageHeader, NButton} from 'naive-ui';
import {getFirstElementArray} from '@/utils/getFirstElementFromArray.ts';
import {useRoute, RouterLink, useRouter} from 'vue-router';
import axios from '@/apis/index.ts';
import PartsFilter from '@/components/Parts/PartsFilter.vue';
import type {DataTableColumns} from 'naive-ui'

interface RowData {
  id: number
  name: string,
  pictures: any[],
  price: number,
  status: string,
  modification: {
    modelCar: {
      name: string,
      startDate: string
    }
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
                    h('div', {}, {default: () => `${row.modification.modelCar.name} ${row.modification.modelCar.startDate}`}),
                    h('div', {}, {default: () => '2001 АКПП LHD '})
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
      title: "Склад",
      key: "warehouse.name"
    },
    {
      title: "Цена",
      key: "price",
      render(row) {
        return h('div', {}, {default: () => `${row.price}₸`})
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
        return h(NTag, {type: typeLabel}, {default: () => row.status})
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

const columns = createColumns();
const items = ref<any[]>([]);
const isLoading = ref(false);
const route = useRoute();


const handleCheck = () => {

}

const rowKey = (row: RowData) => {
  return row.id
}

function handleFiltersChange(filters: any) {
  getProducts({page: paginationReactive.page, status: filters.status})
}


const getProducts = ({
                       page, status, capacityFrom, capacityTo,
                       //@ts-ignore
                       manufacturer, modelCar, yearEnd, yearStart,
                       fuelType, driveType, gearType, color, powerFrom,
                       powerTo, priceEnd, priceStart, bodyType
                     }: {
  page: number, status?: number,
  capacityFrom?: number,
  capacityTo?: number,
  manufacturer?: number,
  modelCar?: number,
  yearStart?: string,
  yearEnd?: string,
  fuelType?: number,
  driveType?: number,
  gearType?: number,
  color?: number,
  powerFrom?: number,
  powerTo?: number,
  priceStart?: number,
  priceEnd?: number,
  bodyType?: number
}) => {
  isLoading.value = true;
  let url = `/api/product/?page=${page}&page_size=10`;
  if (status != undefined) {
    url += `&status=${status}`
  }
  if (capacityFrom != undefined) {
    url += `&capacity_min=${capacityFrom}`
  }
  if (capacityTo != undefined) {
    url += `&capacity_max=${capacityTo}`
  }
  if (priceStart != undefined) {
    url += `&price_min=${priceStart}`
  }
  if (priceEnd != undefined) {
    url += `&price_max=${priceEnd}`
  }
  if (powerFrom != undefined) {
    url += `&power_from=${powerFrom}`
  }
  if (powerTo != undefined) {
    url += `&power_to=${powerTo}`
  }
  if (manufacturer != undefined) {
    url += `&manufacturer=${manufacturer}`
  }
  if (modelCar != undefined) {
    url += `&model_car=${modelCar}`
  }
  if (modelCar != undefined) {
    url += `&model_car=${modelCar}`
  }
  if (fuelType != undefined) {
    url += `&fuel_type=${fuelType}`
  }
  if (driveType != undefined) {
    url += `&drive_type=${driveType}`
  }
  if (gearType != undefined) {
    url += `&gear_type=${gearType}`
  }
  if (color != undefined) {
    url += `&color=${color}`
  }
  if (bodyType != undefined) {
    url += `&body_type=${bodyType}`
  }

  axios.get(url).then((response) => {
    items.value = response.data.results;
    paginationReactive.itemCount = response.data.count
  }).finally(() => {
    isLoading.value = false;
  });
}


const updateFromFilter = (filterForm: any) => {
  getProducts({page: 1, ...filterForm})
}

const onChangedPage = (page: number) => {
  getProducts({page: page});
}

onMounted(() => {
  const page = route.query.page != undefined ? parseInt(route.query.page.toString()) : 1
  getProducts({page: page});
});

</script>