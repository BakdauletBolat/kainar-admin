    
<template>
    <!-- 
      Этот блок по-прежнему рендерится, но скрыт за пределами экрана.
      ID 'printable-content' используется для его захвата функцией печати.
    -->
    <div
      v-if="product"
      id="printable-content"
      class="absolute left-[-9999px] top-[-9999px] p-8 font-sans"
    >
      <div class="mx-auto max-w-4xl bg-white p-10">
        <div class="flex items-start justify-between gap-8">
          <!-- Левая колонка с информацией (без изменений) -->
          <div>
            <h1 class="text-4xl font-bold text-gray-800">
              {{ product.name }}
            </h1>
            <p class="mt-6 font-bold text-2xl text-gray-700">ID: #{{ product.id }}</p>
            <div class="mt-8 space-y-3 text-lg text-gray-600">
              <p v-if="product.warehouse">
                <span class="font-semibold">Место нахождения:</span>
                {{ product.warehouse?.name || "-" }}
              </p>
              <p v-if="product.code.length > 0">
                <span class="font-semibold">OEM коды:</span>
                {{ product.code || "-" }}
              </p>
              <p v-if="product.comment">
                <span class="font-semibold">Комментарий:</span>
                {{ product.comment || "-" }}
              </p>
              <div
                class="mt-4 border-t pt-4"
                v-if="product.eav_attributes?.modelCar"
              >
                <p class="font-semibold">Параметры ТР:</p>
                <p>
                  {{ product.eav_attributes.modelCar.manufacturer?.name }}
                  {{ product.eav_attributes.modelCar.name }}
                </p>
                <p>
                  {{ product.eav_attributes.modelCar.startDate }} -
                  {{ product.eav_attributes.modelCar.endDate }}
                </p>
                <p>
                  {{ product.eav_attributes.capacity }}л,
                  {{ product.eav_attributes.fuelType }},
                  {{ product.eav_attributes.modelCar.gearboxType }}
                </p>
              </div>
            </div>
          </div>
  
          <!-- ИЗМЕНЕНИЕ ЗДЕСЬ: Правая колонка теперь с QR-кодом -->
          <div class="flex-shrink-0">
            <qrcode-vue
              :value="productUrl"
              :size="150"
              level="H"
              render-as="svg"
            />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, toRefs } from 'vue';
  import type { ProductDetail } from '@/apis/products';
  // 1. Импортируем компонент для QR-кода
  import QrcodeVue from 'qrcode.vue';
  
  interface Props {
    product: ProductDetail | null;
  }
  
  const props = defineProps<Props>();
  const { product } = toRefs(props);
  
  // URL для QR-кода вычисляется так же, как и раньше
  const productUrl = computed(() => {
      if (product.value) {
          return `https://kaynar-admin.netlify.app/parts/${product.value.id}`;
      }
      return ''; // Возвращаем пустую строку, если данных еще нет
  });
  </script>
  
    