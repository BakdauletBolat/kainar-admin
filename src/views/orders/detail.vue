<template>
  <main>
    <n-modal v-model:show="showModal">
      <n-card style="width: 600px" title="Вы хотите сделать возврат?" :bordered="false" size="huge" role="dialog"
              aria-modal="true">
        <n-input v-model:value="comment" placeholder="Причина возврата"></n-input>
        <template #footer>
          <div class="w-full flex gap-2 justify-end">
            <n-button @click="showModal = false">Отменить</n-button>
            <n-button :loading="orderStore.isLoadingRefundOrder" type="error" @click="() => orderStore.refundOrder(comment).then(_ => {
              showModal = false;
              message.success('Заказ успешно возвращен');
            }).catch(e => {
              message.error(`Ошибка возврата заказа ${e}`);
            })">Подтвердить
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showConfirmPaymentModal">
      <n-card style="width: 600px" title="Подтвердить оплату клиента?" :bordered="false" size="huge" role="dialog"
              aria-modal="true">
        <div>Пожалуйста, убедитесь, что данные оплаты клиента верны, прежде чем подтвердить это действие.</div>
        <template #footer>
          <div class="w-full flex gap-2 justify-end">
            <n-button @click="showConfirmPaymentModal = false">Отменить</n-button>
            <n-button :loading="orderStore.isLoadingConfirmPaymentOrder" type="info" @click="() => orderStore.confirmPaymentOrder().then(_ => {
              showConfirmPaymentModal = false;
              message.success(`Статус оплаты заказа №${orderStore.order?.id} успешно изменён`);
            }).catch(e => {
              message.error(`Ошибка при подтверждении оплаты ${e}`);
            })">Да, подтвердить оплату
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showConfirmModal">
      <n-card style="width: 600px" title="Завершить заказ?" :bordered="false" size="huge" role="dialog"
              aria-modal="true">
        <div>Вы уверены, что хотите завершить заказ?</div>
        <template #footer>
          <div class="w-full flex gap-2 justify-end">
            <n-button @click="showConfirmModal = false">Отменить</n-button>
            <n-button :loading="orderStore.isLoadingConfirmPaymentOrder" type="info" @click="() => orderStore.confirmOrder().then(_ => {
              showConfirmModal = false;
              message.success(`Заказ успешно завершён`);
            }).catch(e => {
              message.error(`Ошибка при завершении заказа ${e}`);
            })">Да, завершить заказ
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showCancelModal">
      <n-card style="width: 600px" title="Отменить заказ?" :bordered="false" size="huge" role="dialog"
              aria-modal="true">
        <div>Вы собираетесь отменить заказ №{{ orderStore.order?.id }}. Это действие необратимо и клиент будет
          уведомлён. Убедитесь, что заказ действительно нужно отменить.
        </div>
        <template #footer>
          <div class="w-full flex gap-2 justify-end">
            <n-button @click="showCancelModal = false">Отменить</n-button>
            <n-button :loading="orderStore.isLoadingConfirmPaymentOrder" type="error" @click="() => orderStore.cancelOrder().then(_ => {
              showCancelModal = false;
              message.success(`Заказ успешно отменён`);
            }).catch(e => {
              message.error(`Ошибка при отмене заказа ${e}`);
            })">Да, отменить заказ
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
    <n-page-header class="mb-4" @back="handleBack">
      <template #title>
        <n-ellipsis style="max-width: 240px">
          {{ orderStore?.orderName }}
        </n-ellipsis>
      </template>
      <template #subtitle>
        <div class="flex gap-2">
          <span>{{ orderStore.order?.total }} KZT</span>
          <span>{{ timeAgo(new Date(orderStore.order!.created_at)) }}</span>
        </div>
      </template>
    </n-page-header>
    <section>
      <div class="flex w-full justify-between">
        <h1 class="text-2xl font-bold mb-4">Детали заказа</h1>
        <div class="flex gap-2">
          <div>
            <n-button v-if="orderStore.order?.status == 'Завершен'" @click="showModal = true">Оформить возврат
            </n-button>
          </div>
          <div>
            <n-button tertiary type="info" v-if="orderStore.order?.payment_status == 'В ожидании'"
                      @click="showConfirmPaymentModal = true">Подтвердить оплату
            </n-button>
          </div>
          <div>
            <n-button tertiary type="success"
                      v-if="orderStore.order?.payment_status == 'Оплачен' && orderStore.order.status == 'В процессе'"
                      @click="showConfirmModal = true">Завершить заказ
            </n-button>
          </div>
          <div>
            <n-button tertiary type="error" v-if="orderStore.order?.status == 'В процессе'"
                      @click="showCancelModal = true">Отменить заказ
            </n-button>
          </div>
        </div>
      </div>
      <section class="grid gap-2 lg:grid-cols-[2fr_1fr]">
        <article class="grid gap-2">
          <n-table bordered single-column>
            <thead>
            <tr>
              <th>Фото</th>
              <th>Идентификатор товара</th>
              <th>Название</th>
              <th>Кол-во</th>
              <th>Цена</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="good in orderStore.order?.goods">
              <td>
                <router-link :to="{
                    name: 'parts-detail',
                    params: { id: good.product.id.toString() }
                  }">
                  <NAvatar v-if="good.product.pictures.length > 0" :src="good.product.pictures[0].image"
                           class="object-cover !w-[140px] !h-[140px]"/>
                </router-link>
              </td>
              <td class="font-bold">#{{ good.product.id }}</td>
              <td>{{ good.product.name }} ({{ good.product.modification?.modelCar?.manufacturer.name }})</td>
              <td>{{ good.quantity }}</td>
              <td>
                <tenge-amount :value="good.product.price"></tenge-amount>
              </td>
            </tr>
            </tbody>
          </n-table>
          <NCard>
            <div>
              <n-timeline size="large" horizontal v-if="orderStore.order">

                <n-timeline-item :type="getOrderStatus()[0]" title="В процессе" :content="getOrderStatus()[1]"/>
                <n-timeline-item :type="getPaymentTypeStatus()[0]" title="Оплата"
                                 :content="getPaymentTypeStatus()[1]"/>
                <n-timeline-item v-if="orderStore.order.status == 'Завершен'" type="success" title="Готово"
                                 content="Заказ уже завершен"/>
              </n-timeline>
            </div>
          </NCard>
        </article>
        <article class="grid gap-2">
          <NCard>
            <h2 class="text-xl gap-2 font-semibold flex items-center">
              <NIcon>
                <Person class="w-6 h-6"></Person>
              </NIcon>
              Информация о клиенте
            </h2>
            <n-divider></n-divider>
            <div>
              <p><strong>Имя:</strong> {{ orderStore.order?.first_name }}</p>
              <p><strong>Фамилия:</strong> {{ orderStore.order?.last_name || 'Не указано' }}</p>
              <p><strong>Телефон:</strong> {{ orderStore.order?.phone_number }}</p>
              <p><strong>Email:</strong> {{ orderStore.order?.email }}</p>
              <p><strong>Комментарий:</strong> {{ orderStore.order?.comment }}</p>
            </div>
          </NCard>
          <NCard>
            <h2 class="text-xl font-semibold flex items-center">
              Итого
            </h2>
            <div class="">
              <div class="flex justify-between items-center">
                <div>Скидка</div>
                <div>
                  <tenge-amount :value="orderStore.order?.discount"></tenge-amount>
                </div>
              </div>
              <div v-for="good in orderStore.order?.goods" class="flex justify-between items-center">
                <div>{{ good.product.name }}</div>
                <div class="flex gap-1 items-center">
                  <tenge-amount :value="good.product.price"></tenge-amount>
                  <span>({{ good.quantity }}шт)</span>
                </div>
              </div>
              <n-divider></n-divider>
              <div class="flex justify-between items-center">
                <div><strong>Итого</strong></div>
                <div>
                  <tenge-amount :value="parseFloat(<string>orderStore.order?.total.toString())"></tenge-amount>
                </div>
              </div>
            </div>
          </NCard>
        </article>
      </section>
    </section>
  </main>
</template>
<script setup lang="ts">
import {
  NPageHeader, NEllipsis, NCard, NTimeline, NDivider, NTimelineItem, NTable, NIcon, NAvatar,
  NButton, NModal, NInput,
  useMessage
} from "naive-ui";
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {useOrderStore} from "@/stores/order-store.ts";
import TengeAmount from "@/components/TengeAmount.vue";
import {Person} from '@vicons/ionicons5';
import {timeAgo} from "../../utils/formatDate.ts";


const router = useRouter();
const route = useRoute();
const orderStore = useOrderStore();
const showModal = ref(false);
const showConfirmPaymentModal = ref(false);
const showConfirmModal = ref(false);
const showCancelModal = ref(false);
const comment = ref('');
const message = useMessage();


function getPaymentTypeStatus(): [any, string] {
  if (orderStore.order?.payment_status == 'Оплачен') {
    return ['success', 'Заказ оплачен'];
  }
  if (orderStore.order?.payment_status == 'В ожидании') {
    return ['warning', 'Ждем оплату от клиента'];
  }
  return ['error', 'Клиент не оплатил'];
}

function getOrderStatus(): [any, string] {

  if (orderStore.order?.status == 'Завершен') {
    return ['success', 'Заказ завершен'];
  }
  if (orderStore.order?.status == 'В процессе') {
    return ['warning', 'Ждем завершение заказа'];
  }
  return ['error', 'Заказ отменен'];
}

onMounted(() => {
  orderStore.loadOrder(route.params.id.toString());
})

function handleBack() {
  router.back();
}
</script>