<template>
  <main class="space-y-5 max-w-5xl">
    <n-breadcrumb class="mb-2">
      <n-breadcrumb-item>
        <router-link to="/" class="text-slate-600 hover:text-slate-900 transition-colors">
          Главная
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        <router-link :to="{ name: 'orders-list' }" class="text-slate-600 hover:text-slate-900 transition-colors">
          Заказы
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        <span class="text-slate-900 font-medium">Создание заказа</span>
      </n-breadcrumb-item>
    </n-breadcrumb>

    <div class="rounded-3xl border border-slate-200/80 bg-white px-6 py-5 shadow-sm">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="flex items-center justify-center w-16 h-16 rounded-lg bg-amber-100 text-amber-700">
            <n-icon :component="CartOutline" :size="32" />
          </div>
          <div>
            <div class="text-2xl font-semibold text-slate-900">Новый заказ</div>
            <div class="text-sm text-slate-600">Выберите товары и заполните данные клиента</div>
          </div>
        </div>
        <n-button quaternary round @click="handleBack">
          Назад
        </n-button>
      </div>
    </div>

    <div class="grid gap-4 lg:grid-cols-[2fr_3fr]">
      <n-card size="large">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-slate-900">Товары</h3>
          <span class="text-xs uppercase tracking-[0.08em] text-slate-500">
            {{ selectedProducts.length }} выбрано
          </span>
        </div>
        <div class="space-y-3">
          <SelectProduct :selected-products="selectedProducts" @selected="selectProductFunc" />
          <div
            v-if="selectedProducts.length"
            class="divide-y divide-slate-100 rounded-2xl border border-slate-100"
          >
            <div
              v-for="product in selectedProducts"
              :key="product.id"
              class="flex items-center gap-3 px-3 py-2"
            >
              <div
                class="overflow-hidden rounded-lg bg-slate-50 ring-1 ring-slate-200/60"
                style="width: 56px; height: 56px; min-width: 56px; min-height: 56px"
              >
                <img
                  v-if="product.pictures?.[0]?.image"
                  :src="product.pictures[0].image"
                  alt="Товар"
                  class="h-full w-full object-cover"
                />
                <div v-else class="flex h-full w-full items-center justify-center text-slate-300">
                  <n-icon :component="ImageOutline" :size="18" />
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-slate-900 truncate">
                  {{ product.name }}
                </p>
                <p class="text-xs text-slate-500">ID {{ product.id }}</p>
              </div>
              <tenge-amount :value="product.price" />
            </div>
          </div>
          <p v-else class="text-sm text-slate-500">Выберите товары для заказа</p>
        </div>
      </n-card>

      <n-card size="large">
        <div class="mb-3">
          <h3 class="text-lg font-semibold text-slate-900">Данные заказа</h3>
          <p class="text-sm text-slate-500 mt-1">Заполните контактные данные клиента и параметры заказа</p>
        </div>

        <n-form :model="form" label-placement="top" label-align="left" class="grid gap-4 sm:grid-cols-2">
          <n-form-item label="Тип доставки">
            <n-select
              v-model:value="form.delivery_type_id"
              :options="deliveryTypeOptions"
              placeholder="Выберите тип доставки"
              size="large"
            />
          </n-form-item>

          <n-form-item label="Тип оплаты">
            <n-select
              v-model:value="form.payment_type_id"
              :options="paymentTypeOptions"
              placeholder="Выберите тип оплаты"
              size="large"
            />
          </n-form-item>

          <n-form-item label="Склад" class="sm:col-span-2">
            <n-select
              v-model:value="form.warehouse_id"
              :loading="warehouseStore.isLoading"
              clearable
              filterable
              remote
              size="large"
              placeholder="Выберите склад"
              :options="warehouseStore.warehousesOptions"
              @search="handleSearchWarehouse"
            />
          </n-form-item>

          <n-form-item label="Имя">
            <n-input v-model:value="form.first_name" placeholder="Введите имя" size="large" />
          </n-form-item>

          <n-form-item label="Номер телефона">
            <n-input v-model:value="form.phone_number" placeholder="Введите номер телефона" size="large" />
          </n-form-item>

          <n-form-item label="Email">
            <n-input v-model:value="form.email" type="text" placeholder="Введите email" size="large" />
          </n-form-item>

          <n-form-item label="Скидка">
            <n-input-number
              v-model:value="form.discount"
              :min="-2147483648"
              :max="2147483647"
              placeholder="Введите скидку"
              class="w-full"
              size="large"
            />
          </n-form-item>

          <n-form-item label="Комментарий" class="sm:col-span-2">
            <n-input
              v-model:value="form.comment"
              type="textarea"
              placeholder="Введите комментарий"
              size="large"
            />
          </n-form-item>
        </n-form>

        <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <n-button quaternary round size="large" @click="handleBack">Отмена</n-button>
          <n-button
            type="primary"
            round
            size="large"
            :loading="orderStore.isLoadingCreate"
            @click="submitForm"
          >
            Создать заказ
          </n-button>
        </div>
      </n-card>
    </div>
  </main>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  NButton,
  NCard,
  NInput,
  NForm,
  NFormItem,
  NSelect,
  NInputNumber,
  useMessage,
  NBreadcrumb,
  NBreadcrumbItem,
  NIcon
} from 'naive-ui';
import { CartOutline, ImageOutline } from '@vicons/ionicons5';
import { SelectProduct } from '@features/order/create-order';
import { useWarehouseStore } from '@entities/warehouse';
import { useOrderStore } from '@entities/order';
import { ProductList } from '@entities/part';
import TengeAmount from '@/shared/ui/TengeAmount.vue';

const router = useRouter();
const warehouseStore = useWarehouseStore();
const orderStore = useOrderStore();
const message = useMessage();

const form = reactive({
  delivery_type_id: null as number | null,
  payment_type_id: null as number | null,
  warehouse_id: null as number | null,
  client: null as string | null,
  first_name: '',
  phone_number: '',
  email: '',
  address: null as string | null,
  discount: 0,
  comment: ''
});

const selectedProducts = ref<ProductList[]>([]);

const deliveryTypeOptions = ref([
  { label: 'Курьер', value: 1 },
  { label: 'Самовывоз', value: 2 }
]);

const paymentTypeOptions = ref([
  { label: 'Наличные', value: 1 },
  { label: 'Карта', value: 2 }
]);

function submitForm() {
  if (!selectedProducts.value.length) {
    message.warning('Выберите хотя бы один товар');
    return;
  }

  orderStore
    .createOrder({
      delivery_type_id: form.delivery_type_id as number,
      payment_type_id: form.payment_type_id as number,
      warehouse_id: form.warehouse_id as number,
      comment: form.comment,
      discount: form.discount,
      first_name: form.first_name,
      phone_number: form.phone_number,
      email: form.email,
      goods: selectedProducts.value.map((product) => {
        return {
          product_id: product.id,
          quantity: 1,
          quality_id: 1
        };
      })
    })
    .then((res: any) => {
      if (!res?.id) return;
      message.success('Успешно создан');
      router.push({
        name: 'orders-detail',
        params: {
          id: res.id
        }
      });
    })
    .catch((e: any) => {
      message.error(e?.toString?.() || 'Ошибка создания заказа');
      throw e;
    });
}

onMounted(() => {
  warehouseStore.loadWarehouses({ page_size: 10 });
});

function handleBack() {
  router.back();
}

function handleSearchWarehouse(value: string) {
  warehouseStore.loadWarehouses({
    search: value
  });
}

function selectProductFunc(product: any) {
  const productIndex = selectedProducts.value.findIndex((p) => p.id === product.id);
  if (productIndex !== -1) {
    selectedProducts.value.splice(productIndex, 1);
  } else {
    selectedProducts.value.push(product);
  }
}
</script>
