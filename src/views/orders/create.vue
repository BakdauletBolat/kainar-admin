<template>
    <main>
        <n-page-header @back="handleBack" class="mb-4">
            <template #title>
                Создание
            </template>
        </n-page-header>
        <n-card>
            <SelectProduct :selected-products="selectedProducts" @selected="selectProduct"></SelectProduct>
            <div class="mt-8 p-4 rounded-lg">
                <h2 class="text-2xl font-bold mb-4">Форма заказа</h2>
                <n-form label-placement="left" label-width="160px">
                    <!-- Select Delivery Type -->
                    <n-form-item label="Тип доставки">
                        <n-select v-model:value="form.delivery_type_id" :options="deliveryTypeOptions"
                            placeholder="Выберите тип доставки" />
                    </n-form-item>

                    <!-- Select Payment Type -->
                    <n-form-item label="Тип оплаты">
                        <n-select v-model:value="form.payment_type_id" :options="paymentTypeOptions"
                            placeholder="Выберите тип оплаты" />
                    </n-form-item>

                    <!-- Select Warehouse -->
                    <n-form-item label="Склад">
                        <n-select :loading="warehouseStore.isLoading" clearable filterable remote
                            @search="handleSearchWarehouse" v-model:value="form.warehouse_id"
                            :options="warehouseStore.warehousesOptions" placeholder="Выберите склад" />
                    </n-form-item>


                    <!-- First Name -->
                    <n-form-item label="Имя">
                        <n-input v-model:value="form.first_name" placeholder="Введите имя" />
                    </n-form-item>

                    <!-- Phone Number -->
                    <n-form-item label="Номер телефона">
                        <n-input v-model:value="form.phone_number" placeholder="Введите номер телефона" />
                    </n-form-item>

                    <!-- Email -->
                    <n-form-item label="Email">
                        <n-input v-model:value="form.email" type="text" placeholder="Введите email" />
                    </n-form-item>

                    <!-- Address -->
                    <n-form-item label="Адрес">
                        <n-select v-model:value="form.address" :options="addressOptions" placeholder="Выберите адрес" />
                    </n-form-item>

                    <!-- Discount -->
                    <n-form-item label="Скидка">
                        <n-input-number v-model:value="form.discount" :min="-2147483648" :max="2147483647"
                            placeholder="Введите скидку" />
                    </n-form-item>

                    <!-- Comment -->
                    <n-form-item label="Комментарий">
                        <n-input v-model:value="form.comment" type="textarea" placeholder="Введите комментарий" />
                    </n-form-item>

                    <n-button block type="primary" @click="submitForm">Отправить</n-button>
                </n-form>
            </div>
        </n-card>
    </main>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { NPageHeader, NCard, NInput, NForm, NFormItem, NSelect, NInputNumber, NButton } from "naive-ui";
import SelectProduct from './ui/SelectProduct.vue';
import { onMounted, ref } from 'vue'
import { useWarehouseStore } from '@/stores/warehouses-store';
import {useOrderStore} from "@/stores/order-store.ts";
import {ProductList} from "@/apis/orders.ts";

const router = useRouter();
const warehouseStore = useWarehouseStore();
const orderStore = useOrderStore();

// Форма и ее данные
const form = ref<any>({
    delivery_type_id: null,
    payment_type_id: null,
    warehouse_id: null,
    client: null,
    first_name: '',
    phone_number: '',
    email: '',
    address: null,
    discount: 0,
    comment: ''
})

const selectedProducts = ref<ProductList[]>([])


// Опции для селектов
const deliveryTypeOptions = ref([
    { label: 'Курьер', value: 1 },
    { label: 'Самовывоз', value: 2 }
])

const paymentTypeOptions = ref([
    { label: 'Наличные', value: 1 },
    { label: 'Карта', value: 2 }
])


const addressOptions = ref([
    { label: 'Адрес 1', value: 1 },
    { label: 'Адрес 2', value: 2 }
])

function submitForm() {
  console.log('Форма отправлена:', form.value)
  orderStore.createOrder({
    delivery_type_id: form.value.delivery_type_id,
    payment_type_id: form.value.payment_type_id,
    warehouse_id: form.value.warehouse_id,
    comment: form.value.comment,
    discount: form.value.discount,
    first_name: form.value.first_name,
    phone_number: form.value.phone_number,
    email: form.value.email,
    goods: selectedProducts.value.map(product=>{
      return {
        product_id: product.id,
        quantity: 1,
        quality_id: 1
      }
    })
  })
}

onMounted(() => {
    warehouseStore.loadWarehouses({ page_size: 10 });
})

function handleBack() {
    router.back();
}

function handleSearchWarehouse(value: string) {
    warehouseStore.loadWarehouses({
        search: value
    })
}

// Функция выбора товара
function selectProduct(product: any) {
  const productIndex = selectedProducts.value.findIndex(p => p.id === product.id)
  if (productIndex !== -1) {
    // Если товар уже выбран, удаляем его
    selectedProducts.value.splice(productIndex, 1)
  } else {
    // Добавляем товар
    selectedProducts.value.push(product)
  }
}
</script>