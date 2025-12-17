<template>
  <main class="space-y-5">
    <!-- Breadcrumbs -->
    <n-breadcrumb class="mb-2 print:hidden">
      <n-breadcrumb-item>
        <router-link to="/" class="text-slate-600 hover:text-slate-900 transition-colors">
          Главная
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        <router-link :to="{ name: 'parts-list' }" class="text-slate-600 hover:text-slate-900 transition-colors">
          Запчасти
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        <span class="text-slate-900 font-medium">{{ product?.name || 'Детали' }}</span>
      </n-breadcrumb-item>
    </n-breadcrumb>

    <div class="print:hidden">
      <div class="rounded-3xl border border-slate-200/80 bg-white px-6 py-5 shadow-sm">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="space-y-3">
            <div class="flex flex-wrap items-center gap-3">
              <p class="text-2xl font-semibold text-slate-900">
                {{ product?.name || 'Запчасть' }}
              </p>
              <n-tag
                v-if="product?.status"
                round
                :type="getStatusTone(product.status)"
                :bordered="false"
              >
                {{ product.status }}
              </n-tag>
              <span v-if="product?.id" class="text-xs font-semibold text-slate-500">ID {{ product.id }}</span>
            </div>
            <div class="flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <span v-if="product?.warehouse?.name" class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
                Склад: {{ product.warehouse.name }}
              </span>
              <span v-if="product?.warehouse?.city?.name" class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
                {{ product.warehouse.city.name }}
              </span>
              <span v-if="product?.created_at" class="text-slate-500">Создано {{ formatDate(product.created_at) }}</span>
            </div>
            <div class="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-900">
              <span>Цена:</span>
              <span class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-base font-semibold text-slate-900">
                {{ formatPrice(product?.price) }}
              </span>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <n-button quaternary round @click="handleBack">Назад</n-button>
            <n-button secondary round @click="openEdit">Редактировать</n-button>
            <n-button type="primary" round @click="printPage">Печать</n-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Этот блок будет напечатан -->
    <div v-if="!isLoading && product" class="w-full">
      <!-- Передаем данные о продукте в компонент для печати -->
      <PrintForm :product="product"></PrintForm>
    </div>

    <div v-if="isLoading" class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      <NSkeleton height="420px" width="100%" :sharp="false"></NSkeleton>
      <NSkeleton height="420px" width="100%" :sharp="false"></NSkeleton>
      <NSkeleton height="420px" width="100%" :sharp="false"></NSkeleton>
    </div>

    <div v-else-if="product" class="grid w-full gap-4 print:hidden md:grid-cols-[3fr_2fr]">
      <div class="space-y-4">
        <n-card class="w-full" size="large">
          <slider
            class="w-full"
            :product_id="product.id"
            v-if="product?.pictures"
            :pictures="product?.pictures"
          />
        </n-card>


      </div>

      <div class="space-y-4">
        <n-card size="large">
          <h3 class="mb-3 text-lg font-semibold text-slate-900">Технические характеристики автомобиля</h3>
          <div class="grid gap-3 sm:grid-cols-2">
            <div
              v-for="modelCar in modelCarValues"
              :key="modelCar.key"
              class="rounded-2xl bg-slate-50 px-3 py-2"
            >
              <p class="text-xs uppercase tracking-[0.08em] text-slate-500">{{ modelCar.key }}</p>
              <p class="text-sm font-semibold text-slate-900">{{ modelCar.value }}</p>
            </div>
          </div>
        </n-card>

        <n-card size="large" class="w-full">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-slate-900">Параметры детали</h3>
            <span class="text-xs uppercase tracking-[0.08em] text-slate-500">Рабочие поля</span>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Статус</p>
              <n-tag v-if="product?.status" :type="getStatusTone(product.status)" round :bordered="false">
                {{ product.status }}
              </n-tag>
            </div>
            <div class="space-y-2">
              <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">ОЕМ коды</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="code in formattedCodes"
                  :key="code"
                  class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                >{{ code }}</span>
                <span v-if="!formattedCodes.length" class="text-sm text-slate-500">—</span>
              </div>
            </div>
            <div class="space-y-2">
              <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Склад / город</p>
              <p class="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                {{ product?.warehouse?.name ?? '—' }}
                <span v-if="product?.warehouse?.city?.name" class="text-slate-500"> · {{ product.warehouse.city.name }}</span>
              </p>
            </div>
            <div class="space-y-2">
              <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Цветовой код</p>
              <p class="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700">{{ product?.color ?? '—' }}</p>
            </div>
            <div class="space-y-2 sm:col-span-2">
              <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Комментарий</p>
              <p class="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700 min-h-[56px]">
                {{ product?.comment ?? '—' }}
              </p>
            </div>
            <div class="space-y-2">
              <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Дата загрузки</p>
              <p class="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700">{{ formatDate(product?.created_at) }}</p>
            </div>
            <div class="space-y-2">
              <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Состояние</p>
              <p class="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700">{{ product?.defect ? product?.defect : '-' }}</p>
            </div>
            <div class="space-y-2">
              <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Объем двигателя, л</p>
              <p class="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                {{ product?.eav_attributes?.capacity }} <span v-if="product?.eav_attributes?.fuelType">({{ product?.eav_attributes?.fuelType }})</span>
              </p>
            </div>
          </div>
        </n-card>

        <n-card size="large">
          <part-dimensions-component
            :detail="product?.detail"
          ></part-dimensions-component>
        </n-card>
      </div>
    </div>

    <quick-edit-drawer
      :show="isEditOpen"
      :product="product"
      @update:show="(v) => isEditOpen = v"
      @saved="handleSaved"
      @move-warehouse="onChangeWarehouse"
    />
  </main>
</template>
<script setup lang="ts">
import {
    NPageHeader,
    NCard,
    NDescriptions,
    NDescriptionsItem,
    NSkeleton,
    NButton,
    useMessage,
    NTag,
    NBreadcrumb,
    NBreadcrumbItem,
} from "naive-ui";
import axiosIns from "@/apis";
import { useRouter, useRoute } from "vue-router";
import Slider from "@/components/Slider.vue";
import { formatDate } from "@/utils/formatDate";
import { ref, onMounted, computed } from "vue";
import {
    PartDimensionsComponent,
} from "./ui";
import { ProductDetail } from "@/apis/products";
import PrintForm from "@/components/PrintForm.vue";
import QuickEditDrawer from "@/views/parts/components/QuickEditDrawer.vue";

const router = useRouter();
const route = useRoute();
const product = ref<ProductDetail | null>(null);

const isLoading = ref<boolean>(false);
const message = useMessage();
const isEditOpen = ref(false);

onMounted(() => {
    loadProduct();
});

const printPage = (): void => {
  // 1. Находим наш скрытый компонент по ID
  const printContentEl = document.getElementById('printable-content');
  if (!printContentEl) {
    console.error('Элемент для печати (#printable-content) не найден!');
    return;
  }

  // 2. Собираем HTML-строку со всеми стилями из <head> текущей страницы.
  // Это гарантирует, что Tailwind и другие стили будут применены.
  const styleNodes = document.querySelectorAll('link[rel="stylesheet"], style');
  let stylesHtml = '';
  styleNodes.forEach(node => {
    stylesHtml += node.outerHTML;
  });

  // 3. Создаем невидимый iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  // 4. Получаем доступ к документу iframe
  const doc = iframe.contentWindow?.document;
  if (!doc) {
    console.error('Не удалось получить доступ к документу iframe.');
    document.body.removeChild(iframe);
    return;
  }

  // 5. Записываем в iframe ПОЛНЫЙ HTML-документ, включая head со стилями и body с контентом
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Печать</title>
        ${stylesHtml}
      </head>
      <body>
        ${printContentEl.innerHTML}
      </body>
    </html>
  `);
  doc.close();

  // 6. Запускаем печать для iframe и удаляем его
  // Задержка нужна, чтобы браузер успел обработать стили и отрендерить контент
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.error('Ошибка при вызове печати:', e);
    } finally {
      // Удаляем iframe независимо от того, удалась печать или нет
      document.body.removeChild(iframe);
    }
  }, 500); // 500 мс - более безопасная задержка
};

const carInfoMapper: any = {
    manufacturer: "Производитель", // MERCEDES-BENZ
    name: "Модель", // CLK (C208) (1997 - 2002)
    modification: "Модификация", // -
    engineCode: "Код двигателя", // -
    endDate: "Год окончание",
    startDate: "Год", // 1998
    bodyType: "Телосложение", // -
    color: "Цвет", // -
    fuelType: "Тип топлива", // -
    capacity: "Вместимость", // 2.0 L
    gearboxType: "Тип КПП", // -
    driveType: "Тип вождения", // -
    steeringType: "Тип рулевого управления", // -
    mileage: "Пробег", // -
    vinCode: "VIN код",
    id: "Идентификатор", // -
};

const modelCarValues = computed<
    {
        key: string;
        value: string;
    }[]
>(() => {
    if (product.value?.eav_attributes.modelCar != undefined) {
        const modelCar: any = product.value?.eav_attributes.modelCar;
        return Object.keys(modelCar).map((key: string) => {
            if (key == "manufacturer") {
                return {
                    value: modelCar[key].name,
                    key: carInfoMapper[key],
                };
            }
            return {
                value: modelCar[key],
                key: carInfoMapper[key],
            };
        });
    }
    return [];
});

async function loadProduct() {
    const productId = route.params.id.toString();
    isLoading.value = true;
    axiosIns
        .get<ProductDetail>(`/api/v2/product/${productId}/`)
        .then((res) => {
            product.value = res.data;
        })
        .finally(() => {
            isLoading.value = false;
        });
}

async function moveProduct(body: Object) {
    return await axiosIns.post("/api/stock/move/", body).then((res) => {
        console.log("Успешно перемещен", res.data);
    });
}

function onChangeWarehouse(body: Object) {
    if (product.value) {
        moveProduct({
            ...body,
            product_id: product.value.id,
        })
            .then((_) => {
                message.info("Склад успешно обновлен");
                loadProduct();
            })
            .catch((e) => {
                if (e.response.data) {
                    let messageText = "";
                    if (e.response.data.message.non_field_errors) {
                        messageText =
                            e.response.data.message.non_field_errors.join(",");
                    }
                    message.error(messageText);
                    return;
                }
                message.error("Что то не так " + e.toString());
            });
    }
}

function handleBack() {
    router.back();
}

function openEdit() {
    isEditOpen.value = true;
}

function handleSaved() {
    loadProduct();
}

function getStatusTone(status: string | undefined): "success" | "warning" | "info" | "error" | "default" {
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

function formatPrice(price: number | null | undefined) {
    if (price == null) return '—'
    return `${new Intl.NumberFormat('ru-RU').format(price)} ₸`
}

const formattedCodes = computed(() => {
    if (!product.value?.code) return [];
    if (Array.isArray(product.value.code)) return product.value.code.filter(Boolean);
    return String(product.value.code).split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
});
</script>
<style>
@import url("node_modules/@egjs/vue3-flicking/dist/flicking.css");


</style>
