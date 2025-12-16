<template>
  <div class="feedbacks-list-page">
    <n-page-header title="Заявки">
      <template #subtitle>
        {{ feedbackStore.totalCount }}
      </template>
    </n-page-header>

    <div class="content">
      <n-data-table
        :loading="feedbackStore.isLoading"
        :columns="columns"
        :data="feedbackStore.feedbacks"
        :pagination="pagination"
        :row-key="(row: any) => row.id"
      />
    </div>

    <n-modal
      v-model:show="showCloseModal"
      preset="dialog"
      title="Закрыть заявку"
      positive-text="Да, закрыть"
      negative-text="Отмена"
      @positive-click="handleConfirmClose"
    >
      Вы уверены, что хотите закрыть эту заявку?
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue'
import { NPageHeader, NDataTable, NButton, NTag, NModal, useMessage } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { useFeedbackStore } from '@entities/feedback'
import type { Feedback } from '@entities/feedback'
import { formatDate } from '@shared/lib/formatters/date-formatter'

const message = useMessage()
const feedbackStore = useFeedbackStore()

const showCloseModal = ref(false)
const activeFeedbackId = ref<number | null>(null)

const pagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  itemCount: 0,
  pageSizes: [10, 25, 50, 100],
  onChange: (page: number) => {
    pagination.page = page
    loadFeedbacks()
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    loadFeedbacks()
  }
})

const columns: DataTableColumns<Feedback> = [
  {
    title: 'ID',
    key: 'id',
    width: 80
  },
  {
    title: 'Имя',
    key: 'name'
  },
  {
    title: 'Телефон',
    key: 'phone'
  },
  {
    title: 'Статус',
    key: 'isClosed',
    render(row) {
      return h(
        NTag,
        { type: row.isClosed ? 'success' : 'warning' },
        { default: () => row.isClosed ? 'Закрыта' : 'Открыта' }
      )
    }
  },
  {
    title: 'Дата создания',
    key: 'createdAt',
    render(row) {
      return formatDate(row.createdAt)
    }
  },
  {
    title: 'Действия',
    key: 'actions',
    render(row) {
      if (row.isClosed) return null
      return h(
        NButton,
        {
          size: 'small',
          onClick: () => handleClose(row.id)
        },
        { default: () => 'Закрыть' }
      )
    }
  }
]

onMounted(() => {
  loadFeedbacks()
})

async function loadFeedbacks() {
  await feedbackStore.loadFeedbacks({
    limit: pagination.pageSize,
    offset: (pagination.page - 1) * pagination.pageSize
  })
  pagination.itemCount = feedbackStore.totalCount
}

function handleClose(id: number) {
  activeFeedbackId.value = id
  showCloseModal.value = true
}

async function handleConfirmClose() {
  if (!activeFeedbackId.value) return

  try {
    await feedbackStore.closeFeedback(activeFeedbackId.value)
    message.success('Заявка успешно закрыта')
    await loadFeedbacks()
  } catch (error) {
    message.error('Ошибка при закрытии заявки')
  } finally {
    activeFeedbackId.value = null
  }
}
</script>

<style scoped>
.feedbacks-list-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.content {
  flex: 1;
  margin-top: 16px;
}
</style>
