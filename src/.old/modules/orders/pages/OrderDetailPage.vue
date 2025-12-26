<template>
  <main class="space-y-5">
    <n-modal v-model:show="showModal">
      <n-card
        style="width: 560px"
        title="Вы хотите сделать возврат?"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-input v-model:value="comment" type="textarea" placeholder="Причина возврата" />
        <template #footer>
          <div class="w-full flex gap-2 justify-end">
            <n-button quaternary round @click="showModal = false">Отменить</n-button>
            <n-button
              :loading="orderStore.isLoadingRefundOrder"
              type="error"
              round
              @click="handleRefund"
            >
              Подтвердить
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>

    <n-modal v-model:show="showConfirmPaymentModal">
      <n-card
        style="width: 560px"
        title="Подтвердить оплату клиента?"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <div>Пожалуйста, убедитесь, что данные оплаты клиента верны, прежде чем подтвердить это действие.</div>
        <template #footer>
          <div class="w-full flex gap-2 justify-end">
            <n-button quaternary round @click="showConfirmPaymentModal = false">Отменить</n-button>
            <n-button
              :loading="orderStore.isLoadingConfirmPaymentOrder"
              type="info"
              round
              @click="handleConfirmPayment"
            >
              Да, подтвердить оплату
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>

    <n-modal v-model:show="showConfirmModal">
      <n-card
        style="width: 560px"
        title="Завершить заказ?"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <div>Вы уверены, что хотите завершить заказ?</div>
        <template #footer>
          <div class="w-full flex gap-2 justify-end">
            <n-button quaternary round @click="showConfirmModal = false">Отменить</n-button>
            <n-button
              :loading="orderStore.isLoadingConfirmOrder"
              type="info"
              round
              @click="handleConfirmOrder"
            >
              Да, завершить заказ
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>

    <n-modal v-model:show="showCancelModal">
      <n-card
        style="width: 560px"
        title="Отменить заказ?"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <div>
          Вы собираетесь отменить заказ №{{ order?.id }}. Это действие необратимо и клиент будет уведомлён.
          Убедитесь, что заказ действительно нужно отменить.
        </div>
        <template #footer>
          <div class="w-full flex gap-2 justify-end">
            <n-button quaternary round @click="showCancelModal = false">Отменить</n-button>
            <n-button
              :loading="orderStore.isLoadingCancelOrder"
              type="error"
              round
              @click="handleCancelOrder"
            >
              Да, отменить заказ
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>

    <n-breadcrumb class="mb-2 print:hidden">
      <n-breadcrumb-item>
        <router-link to="/" class="text-slate-600 hover:text-slate-900 transition-colors">
          Главная
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        <router-link
          :to="{ name: 'orders-list' }"
          class="text-slate-600 hover:text-slate-900 transition-colors"
        >
          Заказы
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        <span class="text-slate-900 font-medium">{{ orderTitle }}</span>
      </n-breadcrumb-item>
    </n-breadcrumb>

    <div class="print:hidden">
      <div class="rounded-3xl border border-slate-200/80 bg-white px-6 py-5 shadow-sm">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="space-y-3">
            <div class="flex flex-wrap items-center gap-3">
              <p class="text-2xl font-semibold text-slate-900">
                {{ orderTitle }}
              </p>
              <n-tag v-if="order?.status" round :type="getOrderStatusTone(order.status)" :bordered="false">
                {{ order.status }}
              </n-tag>
              <n-tag
                v-if="order?.payment_status"
                round
                :type="getPaymentStatusTone(order.payment_status)"
                :bordered="false"
              >
                {{ order.payment_status }}
              </n-tag>
              <span v-if="order?.id" class="text-xs font-semibold text-slate-500">ID {{ order.id }}</span>
            </div>

            <div class="flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <span v-if="order?.created_at" class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
                Создан {{ formatDate(order.created_at) }}
              </span>
              <span v-if="order?.warehouse?.name" class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
                Склад: {{ order.warehouse.name }}
              </span>
              <span v-if="order?.warehouse?.city?.name" class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
                {{ order.warehouse.city.name }}
              </span>
            </div>

            <div class="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-900">
              <span>Сумма:</span>
              <span class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-base font-semibold text-slate-900">
                <tenge-amount :value="Number(order?.total || 0)" />
              </span>
              <span
                v-if="order?.discount"
                class="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700"
              >
                Скидка {{ order.discount }}
              </span>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <n-button quaternary round @click="handleBack">Назад</n-button>
            <n-button secondary round @click="handleEdit">Редактировать</n-button>
            <n-button
              v-if="order?.status === 'Завершен'"
              round
              @click="showModal = true"
            >
              Оформить возврат
            </n-button>
            <n-button
              v-if="order?.payment_status === 'В ожидании'"
              tertiary
              type="info"
              round
              @click="showConfirmPaymentModal = true"
            >
              Подтвердить оплату
            </n-button>
            <n-button
              v-if="order?.payment_status === 'Оплачен' && order?.status === 'В процессе'"
              tertiary
              type="success"
              round
              @click="showConfirmModal = true"
            >
              Завершить заказ
            </n-button>
            <n-button
              v-if="order?.status === 'В процессе'"
              tertiary
              type="error"
              round
              @click="showCancelModal = true"
            >
              Отменить заказ
            </n-button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      <n-skeleton height="420px" width="100%" :sharp="false" />
      <n-skeleton height="420px" width="100%" :sharp="false" />
      <n-skeleton height="420px" width="100%" :sharp="false" />
    </div>

    <section v-else-if="order" class="grid w-full gap-4 print:hidden md:grid-cols-[3fr_2fr]">
      <div class="space-y-4">
        <n-card size="large">
          <div class="mb-3 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-slate-900">Состав заказа</h3>
            <span class="text-xs uppercase tracking-[0.08em] text-slate-500">
              {{ order.goods?.length || 0 }} позиций
            </span>
          </div>
          <div class="divide-y divide-slate-100">
            <div
              v-for="good in order.goods"
              :key="good.id"
              class="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <router-link
                :to="{ name: 'parts-detail', params: { id: good.product.id.toString() } }"
                class="overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-200/60"
                style="width: 72px; height: 72px; min-width: 72px; min-height: 72px"
              >
                <img
                  v-if="resolveImageUrl(getPicture(good.product.pictures))"
                  :src="resolveImageUrl(getPicture(good.product.pictures))"
                  class="h-full w-full object-cover"
                  alt="Товар"
                />
                <div
                  v-else
                  class="flex h-full w-full items-center justify-center text-slate-300"
                >
                  <n-icon :component="ImageOutline" :size="20" />
                </div>
              </router-link>

              <div class="flex-1 min-w-[220px]">
                <router-link
                  :to="{ name: 'parts-detail', params: { id: good.product.id.toString() } }"
                  class="text-sm font-semibold text-slate-900 leading-tight hover:text-slate-700"
                >
                  {{ good.product.name }}
                </router-link>
                <p class="text-xs text-slate-600 leading-tight mt-1">
                  {{ good.product.modification?.modelCar?.manufacturer?.name || '—' }}
                </p>
                <div class="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                  <span class="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-medium">
                    ID {{ good.product.id }}
                  </span>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <span class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-900">
                  x{{ good.quantity }}
                </span>
                <tenge-amount :value="good.product.price" />
              </div>
            </div>
          </div>
        </n-card>

        <n-card size="large">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-slate-900">Статусы</h3>
            <span class="text-xs uppercase tracking-[0.08em] text-slate-500">Прогресс</span>
          </div>
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="rounded-2xl bg-slate-50 px-3 py-2">
              <p class="text-xs uppercase tracking-[0.08em] text-slate-500">Заказ</p>
              <div class="mt-1 flex items-center gap-2">
                <n-tag :type="getOrderStatusTone(order.status)" round :bordered="false">
                  {{ order.status }}
                </n-tag>
                <span class="text-sm text-slate-600">{{ orderStatusText }}</span>
              </div>
            </div>
            <div class="rounded-2xl bg-slate-50 px-3 py-2">
              <p class="text-xs uppercase tracking-[0.08em] text-slate-500">Оплата</p>
              <div class="mt-1 flex items-center gap-2">
                <n-tag :type="getPaymentStatusTone(order.payment_status)" round :bordered="false">
                  {{ order.payment_status }}
                </n-tag>
                <span class="text-sm text-slate-600">{{ paymentStatusText }}</span>
              </div>
            </div>
          </div>
        </n-card>
      </div>

      <div class="space-y-4">
        <n-card size="large">
          <h3 class="mb-3 text-lg font-semibold text-slate-900">Информация о клиенте</h3>
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="space-y-2">
              <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Имя</p>
              <p class="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                {{ order.first_name || '—' }}
              </p>
            </div>
            <div class="space-y-2">
              <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Фамилия</p>
              <p class="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                {{ order.last_name || 'Не указано' }}
              </p>
            </div>
            <div class="space-y-2">
              <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Телефон</p>
              <p class="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                {{ order.phone_number || '—' }}
              </p>
            </div>
            <div class="space-y-2">
              <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Email</p>
              <p class="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                {{ order.email || '—' }}
              </p>
            </div>
            <div class="space-y-2 sm:col-span-2">
              <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Комментарий</p>
              <p class="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700 min-h-[56px]">
                {{ order.comment || '—' }}
              </p>
            </div>
          </div>
        </n-card>

        <n-card size="large">
          <div class="mb-3 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-slate-900">Итого</h3>
            <span class="text-xs uppercase tracking-[0.08em] text-slate-500">Оплата</span>
          </div>
          <div class="space-y-3">
            <div class="flex items-center justify-between text-sm text-slate-600">
              <span>Скидка</span>
              <span class="font-semibold text-slate-900">
                <tenge-amount :value="order.discount || 0" />
              </span>
            </div>
            <div class="space-y-2">
              <div
                v-for="good in order.goods"
                :key="`summary-${good.id}`"
                class="flex items-center justify-between text-sm text-slate-700"
              >
                <span class="truncate">{{ good.product.name }}</span>
                <div class="flex items-center gap-2">
                  <tenge-amount :value="good.product.price" />
                  <span class="text-xs text-slate-500">× {{ good.quantity }}</span>
                </div>
              </div>
            </div>
            <n-divider />
            <div class="flex items-center justify-between text-base font-semibold text-slate-900">
              <span>Итого</span>
              <tenge-amount :value="Number(order.total || 0)" />
            </div>
          </div>
        </n-card>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import {
  NBreadcrumb,
  NBreadcrumbItem,
  NButton,
  NCard,
  NDivider,
  NIcon,
  NInput,
  NModal,
  NTag,
  NSkeleton,
  useMessage
} from 'naive-ui';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ImageOutline } from '@vicons/ionicons5';
import axiosIns from '@/shared/api/axios';
import { useOrderStore } from '@/modules/orders/stores/order.store';
import TengeAmount from '@/shared/ui/TengeAmount.vue';
import { formatDate } from '@/shared/lib/formatDate';
import { getFirstElementArray } from '@/shared/lib/getFirstElementFromArray';

const router = useRouter();
const route = useRoute();
const orderStore = useOrderStore();
const message = useMessage();

const showModal = ref(false);
const showConfirmPaymentModal = ref(false);
const showConfirmModal = ref(false);
const showCancelModal = ref(false);
const comment = ref('');

const apiBase = (axiosIns.defaults.baseURL || '').replace(/\/$/, '');

const order = computed(() => orderStore.order);
const isLoading = computed(() => orderStore.isLoadingOrders);
const orderTitle = computed(() => orderStore.orderName || (order.value ? `Заказ #${order.value.id}` : 'Заказ'));

const orderStatusText = computed(() => getOrderStatusDescription(order.value?.status));
const paymentStatusText = computed(() => getPaymentStatusDescription(order.value?.payment_status));

function resolveImageUrl(path?: string) {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${apiBase}/${path.replace(/^\//, '')}`;
}

function getPicture(pictures: any[]) {
  const image = getFirstElementArray(pictures);
  if (!image) return null;
  if (typeof image === 'string') return image;
  return image.image || image.url || image.image_url || image.thumbnail || null;
}

function getOrderStatusTone(status: string | undefined): 'success' | 'warning' | 'info' | 'error' | 'default' {
  switch (status) {
    case 'Завершен':
      return 'success';
    case 'В процессе':
      return 'warning';
    case 'Отменен':
      return 'error';
    default:
      return 'info';
  }
}

function getPaymentStatusTone(
  status: string | undefined
): 'success' | 'warning' | 'info' | 'error' | 'default' {
  switch (status) {
    case 'Оплачен':
      return 'success';
    case 'В ожидании':
      return 'warning';
    case 'Отклонен':
      return 'error';
    default:
      return 'default';
  }
}

function getOrderStatusDescription(status?: string) {
  if (status === 'Завершен') return 'Заказ завершен';
  if (status === 'В процессе') return 'Ждем завершения заказа';
  if (status === 'Отменен') return 'Заказ отменен';
  return 'Статус не определен';
}

function getPaymentStatusDescription(status?: string) {
  if (status === 'Оплачен') return 'Оплата подтверждена';
  if (status === 'В ожидании') return 'Ожидаем оплату клиента';
  if (status === 'Отклонен') return 'Оплата отклонена';
  return 'Статус оплаты неизвестен';
}

function handleBack() {
  router.back();
}

function handleEdit() {
  router.push({ name: 'orders-edit', params: { id: route.params.id } });
}

async function handleRefund() {
  try {
    await orderStore.refundOrder(comment.value);
    showModal.value = false;
    message.success('Заказ успешно возвращен');
  } catch (e: any) {
    message.error(`Ошибка возврата заказа ${e}`);
  }
}

async function handleConfirmPayment() {
  try {
    await orderStore.confirmPaymentOrder();
    showConfirmPaymentModal.value = false;
    message.success(`Статус оплаты заказа №${order.value?.id} успешно изменён`);
  } catch (e: any) {
    message.error(`Ошибка при подтверждении оплаты ${e}`);
  }
}

async function handleConfirmOrder() {
  try {
    await orderStore.confirmOrder();
    showConfirmModal.value = false;
    message.success('Заказ успешно завершён');
  } catch (e: any) {
    message.error(`Ошибка при завершении заказа ${e}`);
  }
}

async function handleCancelOrder() {
  try {
    await orderStore.cancelOrder();
    showCancelModal.value = false;
    message.success('Заказ успешно отменён');
  } catch (e: any) {
    message.error(`Ошибка при отмене заказа ${e}`);
  }
}

onMounted(() => {
  orderStore.loadOrder(route.params.id.toString());
});
</script>
