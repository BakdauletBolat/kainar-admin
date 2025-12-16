<template>
  <main class="space-y-6 pb-4">
    <!-- Refund -->
    <n-modal v-model:show="showRefundModal">
      <n-card style="width: 560px" title="Оформить возврат?" :bordered="false" size="huge" role="dialog"
        aria-modal="true" class="rounded-2xl">
        <div class="space-y-3">
          <p class="text-slate-600">Укажите причину возврата. Сумма будет возвращена после подтверждения.</p>
          <n-input v-model:value="comment" placeholder="Причина возврата" type="textarea" />
        </div>
        <template #footer>
          <div class="w-full flex gap-2 justify-end">
            <n-button @click="showRefundModal = false">Отменить</n-button>
            <n-button :loading="orderStore.isLoadingRefundOrder" type="error"
              @click="() => orderStore.refundOrder(comment).then(() => { showRefundModal = false; message.success('Заказ успешно возвращен'); }).catch(e => { message.error(`Ошибка возврата заказа ${e}`); })">
              Подтвердить
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>

    <!-- Confirm payment -->
    <n-modal v-model:show="showConfirmPaymentModal">
      <n-card style="width: 560px" title="Подтвердить оплату?" :bordered="false" size="huge" role="dialog"
        aria-modal="true" class="rounded-2xl">
        <p class="text-slate-600">Убедитесь, что оплата прошла успешно, прежде чем продолжить.</p>
        <template #footer>
          <div class="w-full flex gap-2 justify-end">
            <n-button @click="showConfirmPaymentModal = false">Отменить</n-button>
            <n-button :loading="orderStore.isLoadingConfirmPaymentOrder" type="info"
              @click="() => orderStore.confirmPaymentOrder().then(() => { showConfirmPaymentModal = false; message.success(`Статус оплаты заказа №${orderStore.order?.id} успешно изменён`); }).catch(e => { message.error(`Ошибка при подтверждении оплаты ${e}`); })">
              Да, подтвердить оплату
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>

    <!-- Complete -->
    <n-modal v-model:show="showCompleteModal">
      <n-card style="width: 560px" title="Завершить заказ?" :bordered="false" size="huge" role="dialog"
        aria-modal="true" class="rounded-2xl">
        <p class="text-slate-600">После завершения заказ переместится в историю.</p>
        <template #footer>
          <div class="w-full flex gap-2 justify-end">
            <n-button @click="showCompleteModal = false">Отменить</n-button>
            <n-button :loading="orderStore.isLoadingConfirmPaymentOrder" type="success"
              @click="() => orderStore.confirmOrder().then(() => { showCompleteModal = false; message.success('Заказ успешно завершён'); }).catch(e => { message.error(`Ошибка при завершении заказа ${e}`); })">
              Завершить
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>

    <!-- Cancel -->
    <n-modal v-model:show="showCancelModal">
      <n-card style="width: 560px" title="Отменить заказ?" :bordered="false" size="huge" role="dialog"
        aria-modal="true" class="rounded-2xl">
        <p class="text-slate-600">Это действие необратимо, клиент будет уведомлен.</p>
        <template #footer>
          <div class="w-full flex gap-2 justify-end">
            <n-button @click="showCancelModal = false">Вернуться</n-button>
            <n-button :loading="orderStore.isLoadingConfirmPaymentOrder" type="error"
              @click="() => orderStore.cancelOrder().then(() => { showCancelModal = false; message.success('Заказ успешно отменён'); }).catch(e => { message.error(`Ошибка при отмене заказа ${e}`); })">
              Да, отменить
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>

    <section
      class="relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-5 md:p-7 backdrop-blur-2xl shadow-[0_18px_60px_rgba(15,23,42,0.12)]">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute -top-10 left-10 h-32 w-32 rounded-full bg-[#dce7ff] blur-3xl"></div>
        <div class="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-[#ffe8b5] blur-3xl opacity-80"></div>
      </div>
      <div class="relative flex flex-col gap-4">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <n-button text circle @click="handleBack">
                <template #icon>
                  <n-icon>
                    <ChevronLeftIcon />
                  </n-icon>
                </template>
              </n-button>
              <p class="text-xs uppercase tracking-[0.08em] text-slate-500">Заказ</p>
            </div>
            <h1 class="text-2xl md:text-3xl font-semibold text-slate-900 leading-tight">
              #{{ order?.id ?? '—' }} · {{ orderStore?.orderName || 'Заказ' }}
            </h1>
            <div class="flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span v-if="order?.created_at">Создан {{ timeAgoText(order.created_at) }}</span>
              <span class="inline-flex items-center gap-2 rounded-full bg-slate-900/5 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-900/10">
                <ClockIcon class="h-4 w-4" />
                Обновлен {{ timeAgoText(order?.updated_at) }}
              </span>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <n-tag round size="small" :type="statusType(order?.status)">{{ order?.status || '—' }}</n-tag>
            <n-tag round size="small" :type="paymentType(order?.payment_status)">{{ order?.payment_status || '—' }}</n-tag>
            <div class="text-xl font-semibold text-slate-900">
              {{ formatCurrency(order?.total || 0) }}
            </div>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <n-button tertiary v-if="order?.status === 'Завершен'" @click="showRefundModal = true">Оформить возврат</n-button>
          <n-button tertiary type="info" v-if="order?.payment_status === 'В ожидании'" @click="showConfirmPaymentModal = true">
            Подтвердить оплату
          </n-button>
          <n-button tertiary type="success" v-if="order?.payment_status === 'Оплачен' && order?.status === 'В процессе'"
            @click="showCompleteModal = true">
            Завершить заказ
          </n-button>
          <n-button tertiary type="error" v-if="order?.status === 'В процессе'" @click="showCancelModal = true">
            Отменить заказ
          </n-button>
        </div>
      </div>
    </section>

    <section class="grid gap-5 lg:grid-cols-[1.7fr_1fr]">
      <div class="space-y-5">
        <article
          class="rounded-3xl border border-white/70 bg-white/80 p-5 md:p-6 backdrop-blur-2xl shadow-[0_16px_50px_rgba(15,23,42,0.1)]">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-xs uppercase tracking-[0.08em] text-slate-500">Состав заказа</p>
              <h2 class="text-lg font-semibold text-slate-900">Товары</h2>
            </div>
            <n-tag round size="small" type="info">{{ order?.goods?.length || 0 }} позиций</n-tag>
          </div>
          <div v-if="isLoading" class="space-y-3">
            <div v-for="idx in 3" :key="idx" class="rounded-2xl border border-white/70 bg-white/60 p-4">
              <n-skeleton height="18px" width="40%" />
              <n-skeleton height="14px" width="60%" class="mt-2" />
            </div>
          </div>
          <div v-else-if="!order?.goods?.length" class="text-sm text-slate-500">
            Товары не найдены.
          </div>
          <div v-else class="space-y-3">
            <div v-for="good in order.goods" :key="good.id"
              class="group flex flex-col gap-3 rounded-2xl border border-white/70 bg-white/80 p-4 shadow-[0_12px_36px_rgba(15,23,42,0.08)] transition hover:-translate-y-[2px] hover:shadow-[0_16px_48px_rgba(15,23,42,0.12)]">
              <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div class="flex gap-3 items-center">
                  <router-link :to="{ name: 'parts-detail', params: { id: good.product.id.toString() } }">
                    <n-avatar v-if="good.product.pictures.length > 0" :src="good.product.pictures[0].image"
                      class="!h-[84px] !w-[84px] object-cover ring-1 ring-slate-200" />
                    <div v-else class="flex h-[84px] w-[84px] items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                      Нет фото
                    </div>
                  </router-link>
                  <div class="space-y-1">
                    <p class="text-sm text-slate-500">#{{ good.product.id }}</p>
                    <p class="text-lg font-semibold text-slate-900">{{ good.product.name }}</p>
                    <p class="text-sm text-slate-600">
                      {{ good.product.modification?.modelCar?.manufacturer.name }}
                    </p>
                  </div>
                </div>
                <div class="flex flex-wrap gap-3 md:items-center">
                  <div class="rounded-xl bg-slate-900/5 px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-900/10">
                    {{ good.quantity }} шт
                  </div>
                  <div class="text-lg font-semibold text-slate-900">
                    <tenge-amount :value="good.product.price"></tenge-amount>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        <article
          class="rounded-3xl border border-white/70 bg-white/80 p-5 md:p-6 backdrop-blur-2xl shadow-[0_16px_50px_rgba(15,23,42,0.1)]">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-xs uppercase tracking-[0.08em] text-slate-500">Прогресс</p>
              <h2 class="text-lg font-semibold text-slate-900">Оплата и статус</h2>
            </div>
            <n-tag round size="small" type="success" v-if="order?.status === 'Завершен'">готово</n-tag>
          </div>
          <div class="space-y-4">
            <n-timeline size="large" v-if="order">
              <n-timeline-item :type="statusType(order.status)" title="Статус заказа" :content="orderStatusText" />
              <n-timeline-item :type="paymentType(order.payment_status)" title="Оплата"
                :content="paymentStatusText" />
              <n-timeline-item v-if="order.status === 'Завершен'" type="success" title="Выполнено"
                content="Передано клиенту" />
            </n-timeline>
            <div class="grid gap-3 md:grid-cols-2">
              <div class="rounded-2xl bg-slate-900/5 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-900/10">
                <p class="text-xs uppercase tracking-[0.08em] text-slate-500">Склад</p>
                <p class="text-sm font-semibold text-slate-900">{{ order?.warehouse?.name || '—' }}</p>
              </div>
              <div class="rounded-2xl bg-slate-900/5 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-900/10">
                <p class="text-xs uppercase tracking-[0.08em] text-slate-500">Комментарий</p>
                <p class="text-sm text-slate-900">{{ order?.comment || '—' }}</p>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div class="space-y-5">
        <article
          class="rounded-3xl border border-white/70 bg-white/80 p-5 md:p-6 backdrop-blur-2xl shadow-[0_16px_50px_rgba(15,23,42,0.1)]">
          <div class="flex items-center justify-between mb-3">
            <div>
              <p class="text-xs uppercase tracking-[0.08em] text-slate-500">Клиент</p>
              <h2 class="text-lg font-semibold text-slate-900">Контакты</h2>
            </div>
          </div>
          <div class="space-y-2 text-sm text-slate-700">
            <div class="flex items-center justify-between">
              <span class="text-slate-500">Имя</span>
              <span class="font-semibold text-slate-900">{{ order?.first_name || '—' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-500">Фамилия</span>
              <span class="font-semibold text-slate-900">{{ order?.last_name || 'Не указано' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-500">Телефон</span>
              <span class="font-semibold text-slate-900">{{ order?.phone_number || '—' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-500">Email</span>
              <span class="font-semibold text-slate-900">{{ order?.email || '—' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-500">Адрес</span>
              <span class="font-semibold text-slate-900">{{ order?.address || '—' }}</span>
            </div>
          </div>
        </article>

        <article
          class="rounded-3xl border border-white/70 bg-white/80 p-5 md:p-6 backdrop-blur-2xl shadow-[0_16px_50px_rgba(15,23,42,0.1)]">
          <div class="flex items-center justify-between mb-3">
            <div>
              <p class="text-xs uppercase tracking-[0.08em] text-slate-500">Итог</p>
              <h2 class="text-lg font-semibold text-slate-900">Сумма</h2>
            </div>
          </div>
          <div class="space-y-3 text-sm text-slate-700">
            <div class="flex items-center justify-between">
              <span class="text-slate-500">Скидка</span>
              <span class="font-semibold text-slate-900">
                <tenge-amount :value="order?.discount"></tenge-amount>
              </span>
            </div>
            <div v-for="good in order?.goods" :key="good.id" class="flex items-center justify-between">
              <span class="text-slate-500">{{ good.product.name }}</span>
              <span class="font-semibold text-slate-900 flex items-center gap-2">
                <tenge-amount :value="good.product.price"></tenge-amount>
                <span class="text-xs text-slate-500">({{ good.quantity }} шт)</span>
              </span>
            </div>
            <n-divider />
            <div class="flex items-center justify-between text-base font-semibold text-slate-900">
              <span>Итого</span>
              <span>
                <tenge-amount :value="Number(order?.total || 0)"></tenge-amount>
              </span>
            </div>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import {
  NCard,
  NModal,
  NButton,
  NInput,
  NTag,
  NIcon,
  NAvatar,
  NTimeline,
  NTimelineItem,
  NDivider,
  useMessage,
  NSkeleton
} from 'naive-ui';
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import {
  ClockIcon,
  ChevronLeftIcon
} from '@heroicons/vue/24/outline';
import TengeAmount from '@/components/TengeAmount.vue';
import { useOrderStore } from '@/stores/order-store';
import { timeAgo } from '@/utils/formatDate';
import type Order from '@/apis/domain/order';

const router = useRouter();
const route = useRoute();
const orderStore = useOrderStore();
const message = useMessage();

const showRefundModal = ref(false);
const showConfirmPaymentModal = ref(false);
const showCompleteModal = ref(false);
const showCancelModal = ref(false);
const comment = ref('');

const isLoading = computed(() => orderStore.isLoadingOrders);
const order = computed<Order | null>(() => orderStore.order);

const orderStatusText = computed(() => {
  if (order.value?.status === 'Завершен') return 'Заказ завершен';
  if (order.value?.status === 'В процессе') return 'Ждем завершение заказа';
  if (order.value?.status === 'Отменен') return 'Заказ отменен';
  return 'Статус обновляется';
});

const paymentStatusText = computed(() => {
  if (order.value?.payment_status === 'Оплачен') return 'Заказ оплачен';
  if (order.value?.payment_status === 'В ожидании') return 'Ждем оплату от клиента';
  if (order.value?.payment_status === 'Отклонен') return 'Оплата отклонена';
  return 'Статус оплаты обновляется';
});

onMounted(() => {
  orderStore.loadOrder(route.params.id.toString());
});

function handleBack() {
  router.back();
}

function statusType(status?: string) {
  if (status === 'В процессе') return 'warning';
  if (status === 'Отменен') return 'error';
  if (status === 'Завершен') return 'success';
  return 'default';
}

function paymentType(status?: string) {
  if (status === 'Оплачен') return 'success';
  if (status === 'В ожидании') return 'warning';
  if (status === 'Отклонен') return 'error';
  return 'default';
}

function timeAgoText(date?: string) {
  if (!date) return '—';
  return timeAgo(new Date(date));
}

function formatCurrency(value: number | string) {
  const numeric = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(numeric) + ' ₸';
}
</script>
