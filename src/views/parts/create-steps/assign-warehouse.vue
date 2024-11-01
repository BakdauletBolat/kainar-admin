<script setup lang="ts">
import {useProductStore} from "@/stores/product-store.ts";
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {NSelect,NButton, useMessage} from 'naive-ui';
import {useWarehouseStore} from "@/stores/warehouses-store.ts";
import axiosIns from "@/apis";


const productStore = useProductStore();
const warehouseStore = useWarehouseStore();
const route = useRoute();
const router = useRouter();
const message = useMessage();

onMounted(()=>{
  if (route.query.productId != null) {
    productStore.loadProduct(route.query.productId.toString());
  }
  warehouseStore.loadWarehouses({
    page_size: 10,
    page: 1
  })
})


const warehouseId = ref<number>()


function handleSearchWarehouse(value: string) {
  warehouseStore.loadWarehouses({
    search: value
  })
}


onMounted(() => {

})

function assignWarehouse() {
  axiosIns.post("/api/v2/product/assign-warehouse/", {
    warehouse_id:  warehouseId.value,
    product_id: route.query.productId,
  }).then(_ => {
    message.success("Успешно назначен");
    router.push({
      name: "parts-detail",
      params: {
        product_id: route.query.productId?.toString()
      }
    }).catch((e)=>{
      console.log(e)
      message.error("Что то пошло не так")
    })
  })
}


</script>

<template>
<div>
  <div class="flex items-center gap-2 justify-center">
    <n-select :loading="warehouseStore.isLoading" clearable filterable remote
              @search="handleSearchWarehouse" v-model:value="warehouseId"
              :options="warehouseStore.warehousesOptions" placeholder="Выберите склад" />
    <n-button @click="assignWarehouse">
      Назначить на этот склад
    </n-button>
  </div>
</div>
</template>

<style scoped>

</style>