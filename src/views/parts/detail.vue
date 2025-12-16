<template>
    <main class="w-full">
        <div class="print:hidden">
            <n-page-header class="mb-4" @back="handleBack">
            <template #title>
                {{ product?.name }}
            </template>
            <template #subtitle>
                {{ product?.warehouse?.name }} /
                {{ product?.warehouse?.city?.name }}
            </template>
            <template #extra>
                    <n-button
                        type="primary"
                        @click="printPage"
                    >
                        Печать
                    </n-button>
                </template>
        </n-page-header>
        </div>

        <!-- Этот блок будет напечатан -->
        <div v-if="!isLoading && product" class="w-full">
            <!-- Передаем данные о продукте в компонент для печати -->
            <PrintForm :product="product"></PrintForm>
        </div>

        
        <div v-if="isLoading" class="grid grid-cols-3 gap-2">
            <NSkeleton height="400px" width="100%" :sharp="false"></NSkeleton>
            <NSkeleton height="400px" width="100%" :sharp="false"></NSkeleton>
            <NSkeleton height="400px" width="100%" :sharp="false"></NSkeleton>
        </div>
      
        <div v-else class="grid w-full md:grid-cols-2 lg:grid-cols-3 gap-2 print:hidden">    
            <n-card>
                <n-descriptions
                    :column="2"
                    label-placement="top"
                    title="Параметры детали"
                >
                    <n-descriptions-item label="Статус">
                        <status-component
                            @onChangedProp="onChangedStatus"
                            :value="product?.status"
                        ></status-component>
                    </n-descriptions-item>
                    <n-descriptions-item label="ID">
                        #{{ product?.id }}
                    </n-descriptions-item>
                    <n-descriptions-item label="ОЕМ коды">
                        <vin-code-component
                            @on-changed-prop="onChangeCode"
                            :code="product?.code"
                        ></vin-code-component>
                    </n-descriptions-item>
                    <n-descriptions-item label="Цветовой код">
                        {{ product?.color }}
                    </n-descriptions-item>
                    <n-descriptions-item label="Цена">
                        <price-component
                            @on-changed-prop="onChangedPrice"
                            :price="product?.price"
                        ></price-component>
                    </n-descriptions-item>
                    <n-descriptions-item label="Состояние">
                        {{ product?.defect ? product?.defect : "-" }}
                    </n-descriptions-item>
                    <n-descriptions-item label="Место нахождения">
                        <warehouse-component
                            @on-changed-prop="onChangeWarehouse"
                            :view_mode="'named'"
                            :warehouse="product?.warehouse"
                        ></warehouse-component>
                    </n-descriptions-item>
                    <n-descriptions-item label="Комментарий">
                        <comment-component
                            @onChangedProp="onChangedComment"
                            :value="product?.comment"
                        ></comment-component>
                    </n-descriptions-item>
                    <n-descriptions-item label="Дата загрузки">
                        {{ formatDate(product?.created_at) }}
                    </n-descriptions-item>
                    <n-descriptions-item label="Объем двигателя, л">
                        {{ product?.eav_attributes?.capacity }} ({{ product?.eav_attributes?.fuelType }})
                    </n-descriptions-item>
                </n-descriptions>
            </n-card>
            <n-card class="w-full">
                <slider
                    class="w-full"
                    :product_id="product.id"
                    v-if="product?.pictures"
                    :pictures="product?.pictures"
                />
            </n-card>
            <n-card>
                <n-descriptions
                    :column="2"
                    label-placement="top"
                    title="Технические характеристики автомобиля"
                >
                    <n-descriptions-item
                        :key="modelCar.key"
                        :label="modelCar.key"
                        v-for="modelCar in modelCarValues"
                    >
                        {{ modelCar.value }}
                    </n-descriptions-item>
                </n-descriptions>
            </n-card>
            <n-card>
                <part-dimensions-component
                    :detail="product?.detail"
                ></part-dimensions-component>
            </n-card>
        </div>
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
} from "naive-ui";
import axiosIns from "@/apis";
import { useRouter, useRoute } from "vue-router";
import Slider from "@/components/Slider.vue";
import { formatDate } from "@/utils/formatDate";
import { ref, onMounted, computed } from "vue";
import {
    PriceComponent,
    StatusComponent,
    CommentComponent,
    WarehouseComponent,
    PartDimensionsComponent,
    VinCodeComponent,
} from "./ui";
import { ProductDetail } from "@/apis/products";
import PrintForm from "@/components/PrintForm.vue";

const router = useRouter();
const route = useRoute();
const product = ref<ProductDetail | null>(null);

const isLoading = ref<boolean>(false);
const message = useMessage();

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

async function patchProduct(key: string, value: string, productId: number) {
    return await axiosIns
        .patch(`/api/admin/product/v2/product/${productId}/update/`, {
            [key]: value,
        })
        .then((res) => {
            return res.data;
        });
}

async function moveProduct(body: Object) {
    return await axiosIns.post("/api/stock/move/", body).then((res) => {
        console.log("Успешно перемещен", res.data);
    });
}

function onChangedPrice(key: string, value: string) {
    patchProduct(key, value, product.value!.id)
        .then((_) => {
            message.info("Цена успешно обновлен");
            if (product.value) {
                product.value.price = parseInt(value);
            }
        })
        .catch((e) => {
            message.error("Что то не так " + e.toString());
        });
}

function onChangedComment(key: string, value: string) {
    patchProduct(key, value, product.value!.id)
        .then((_) => {
            message.info("Коммент успешно обновлен");
            if (product.value) {
                product.value.comment = value;
            }
        })
        .catch((e) => {
            message.error("Что то не так " + e.toString());
        });
}

function onChangeCode(key: string, value: string) {
    patchProduct(key, value, product.value!.id)
        .then((res) => {
            message.info("Vin code успешно обновлен");
            if (product.value) {
                product.value = res;
            }
        })
        .catch((e) => {
            message.error("Что то не так " + e.toString());
        });
}

function onChangedStatus(
    key: string,
    value: {
        value: number;
        label: string;
    },
) {
    patchProduct(key, value.value.toString(), product.value!.id)
        .then((_) => {
            message.info("Статус успешно обновлен");
            if (product.value) {
                product.value.status = value.label;
            }
        })
        .catch((e) => {
            message.error("Что то не так " + e.toString());
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
</script>
<style>
@import '@egjs/vue3-flicking/dist/flicking.css';
</style>
