<template>
  <main>
    <n-modal v-model:show="showModal">
      <n-card
        style="width: 600px"
        title="Вы хотите сделать возврат?"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-input v-model:value="comment" placeholder="Причина возврата"></n-input>
        <template #footer>
          <div class="w-full flex gap-2 justify-end">
            <n-button @click="showModal = false">Отмена</n-button>
            <n-button :loading="orderStore.isLoadingRefundOrder" 
            type="error" @click="()=>orderStore.refundOrder(comment).then(_=>{
              showModal=false;
              message.success('Заказ успешно возвращен');
            }).catch(e=>{
              message.error(`Ошибка возврата заказа ${e}`);
            })">Подтвердить</n-button>
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
          {{ orderStore?.order?.total }} KZT
      </template>
    </n-page-header>
    <section>
          <div class="flex w-full justify-between">
            <h1 class="text-2xl font-bold mb-4">Детали заказа</h1>
            <div>
              <n-button @click="showModal=true">Сделать возврат</n-button>
            </div>
          </div>
          <section class="grid gap-2 grid-cols-[2fr_1fr]">
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
                      <NAvatar v-if="good.product.pictures.length > 0" :src="good.product.pictures[0].image" class="object-cover !w-[140px] !h-[140px]" />
                    </td>
                    <td class="font-bold">#{{ good.product.id }}</td>
                    <td>{{good.product.name}} ({{ good.product.modification?.modelCar?.manufacturer.name }})</td>
                    <td>{{good.quantity}}</td>
                    <td> <tenge-amount :value="good.product.price"></tenge-amount> </td>
                  </tr>
                  </tbody>
                </n-table>
                <NCard>
                  <div>
                      <n-timeline size="large" horizontal v-if="orderStore.order">

                        <n-timeline-item
                            :type="getOrderStatus()[0]"
                            title="В процессе"
                            :content="getOrderStatus()[1]"
                        />
                        <n-timeline-item
                            :type="getPaymentTypeStatus()[0]"
                            title="Оплата"
                            :content="getPaymentTypeStatus()[1]"
                        />
                        <n-timeline-item
                            v-if="orderStore.order.status == 'Завершен'"
                            type="success"
                            title="Готово"
                            content="Заказ уже завершен"
                        />
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
                      <div>Скидка</div><div><tenge-amount :value="orderStore.order?.discount"></tenge-amount></div>
                    </div>
                    <div v-for="good in orderStore.order?.goods" class="flex justify-between items-center">
                      <div>{{good.product.name}}</div>
                      <div class="flex gap-1 items-center">
                        <tenge-amount :value="good.product.price"></tenge-amount>
                        <span>({{good.quantity}}шт)</span>
                      </div>
                    </div>
                    <n-divider></n-divider>
                    <div class="flex justify-between items-center">
                      <div><strong>Итого</strong></div><div><tenge-amount :value="parseFloat(<string>orderStore.order?.total.toString())"></tenge-amount></div>
                    </div>
                  </div>
                </NCard>
              </article>
          </section>
    </section>
  </main>
</template>
<script setup lang="ts">
import {NPageHeader, NEllipsis, NCard, NTimeline, NDivider, NTimelineItem, NTable,  NIcon, NAvatar,
       NButton, NModal, NInput,
       useMessage} from "naive-ui";
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {useOrderStore} from "@/stores/order-store.ts";
import TengeAmount from "@/components/TengeAmount.vue";
import {Person} from '@vicons/ionicons5';


const router = useRouter();
const route = useRoute();
const orderStore = useOrderStore();
const showModal = ref(false);
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

onMounted(()=>{
  orderStore.loadOrder(route.params.id.toString());
})

function handleBack() {
  router.back();
}
</script>