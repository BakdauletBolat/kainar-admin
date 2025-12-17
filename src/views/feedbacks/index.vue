<template>
  <n-page-header class="mb-4">
    <template #title>
      Заявки
    </template>
    <template #subtitle>
      {{ paginationReactive.itemCount }}
    </template>
    <template #extra>

    </template>
  </n-page-header>
  <main class="grid pb-10">
    <n-modal
        v-model:show="showFeedback"
        preset="dialog"
        title="Закрыть заявку"
        positive-text="Да закрыть"
        negative-text="Отмена"
        @positive-click="submitCallback"
        @negative-click="cancelCallback"
    />
    <div>
      <n-data-table remote :loading="feedbackStore.isLoading" ref="table" :columns="columns"
                    :data="feedbackStore.feedbacks" :pagination="paginationReactive" :row-key="rowKey" />
    </div>
  </main>
</template>
<script setup lang="ts">
import {computed, h, onMounted, reactive, ref} from 'vue';
import {NButton, NDataTable, NPageHeader, NTag, NModal, useMessage} from 'naive-ui';
import { useRoute } from 'vue-router';
import type { DataTableColumns } from 'naive-ui'
import {IFeedback, useFeedbackStore} from "@/stores/feedback-store.ts";
import { timeAgo } from "@/shared/lib/formatDate";

const activeFeedback = ref<number | null>(null);

const showFeedback = computed(()=>{
  return activeFeedback.value != null;
});



const paginationReactive = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  itemCount: 168,
  pageSizes: [5, 10, 25, 50, 100],
  prefix({ itemCount }: any) {
    return `Всего ${itemCount} заявкок`
  },
  onChange: (page: number) => {
    paginationReactive.page = page
    onChangedPage(page);
  },
  onUpdatePageSize: (pageSize: number) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
    onChangedPage(paginationReactive.page);
  }
});

const columns = createColumns();
const route = useRoute();
const feedbackStore = useFeedbackStore();
const message = useMessage();


function cancelCallback() {
  activeFeedback.value = null;
}

function submitCallback() {
  feedbackStore.closeFeedback(activeFeedback.value!).then(() => {
    activeFeedback.value = null;
    message.success("Успешно закрыто заявка")
  }).catch(() => {
    message.error("Ошибка при выполнении операций")
  });
}

function getTagData(c_t: Date | null ) {
  if (c_t == null) return {text: "Не обработан", type: 'info'}
  return {text: "Обработан", type: 'success'};
}

function onClickCloseFeedback(feedbackId: number) {
  activeFeedback.value = feedbackId;
}

function createColumns(): DataTableColumns<IFeedback> {
  return [
    {
      type: 'selection',
    },
    {
      title: "ID",
      key: "id",
    },
    {
      title: "Номер телефона",
      key: "phone"
    },
    {
      title: "Имя клиента",
      key: "name"
    },
    {
      title: "Дата обновление",
      key: "updated_at",
      render(row) {
        return h('div', {}, {default: () => `${timeAgo(new Date(row.updated_at))}`})
      }
    },
    {
      title: "Статус",
      key: "completed_at",
      render(row) {
        return h(NTag, {
          type: getTagData(row.completed_at).type
        }, {default: () => `${getTagData(row.completed_at).text}`})
      }
    },
    {
      title: "Действие",
      key: "actions",
      render(row) {
        if (row.completed_at != null) {
          return h('div', {}, {});
        }
        return h(NButton, {
          onClick: () => onClickCloseFeedback(row.id)
        }, {default: () => `Закрыть заявку`})
      }
    },
  ]
}


const rowKey = (row: any) => {
  return row.id
}

const onChangedPage = (page: number) => {
  feedbackStore.loadFeedbacks({page: page, page_size: paginationReactive.pageSize,
                                      ordering: "-updated_at"})
}


onMounted(() => {
  const page = route.query.page != null ? parseInt(route.query.page.toString()) : 1
  feedbackStore.loadFeedbacks({page: page, page_size: 10, ordering: "-updated_at" }).then(_ => {
    paginationReactive.itemCount = feedbackStore.count;
  });
});

</script>
