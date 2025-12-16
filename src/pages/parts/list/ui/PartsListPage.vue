<template>
  <div class="parts-list-page">
    <n-page-header title="Запчасти">
      <template #extra>
        <n-space>
          <n-button @click="showFilter = !showFilter">
            <template #icon>
              <n-icon><FilterOutline /></n-icon>
            </template>
            Фильтры
          </n-button>
          <n-button type="primary" @click="handleCreate">
            <template #icon>
              <n-icon><AddOutline /></n-icon>
            </template>
            Добавить запчасть
          </n-button>
        </n-space>
      </template>
    </n-page-header>

    <n-layout has-sider class="content">
      <n-layout-sider
        v-if="showFilter"
        bordered
        :width="300"
        :collapsed-width="0"
        :native-scrollbar="false"
      >
        <PartsFilter />
      </n-layout-sider>

      <n-layout-content :native-scrollbar="false">
        <PartsTable
          @create="handleCreate"
          @edit="handleEdit"
        />
      </n-layout-content>
    </n-layout>

    <n-modal v-model:show="showCreateModal" preset="card" title="Создать запчасть" style="width: 800px">
      <CreatePartForm @success="handleCreateSuccess" @cancel="showCreateModal = false" />
    </n-modal>

    <n-modal v-model:show="showEditModal" preset="card" title="Редактировать запчасть" style="width: 800px">
      <EditPartForm
        v-if="editingPartId"
        :part-id="editingPartId"
        @success="handleEditSuccess"
        @cancel="showEditModal = false"
      />
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NPageHeader, NSpace, NButton, NIcon, NLayout, NLayoutSider, NLayoutContent, NModal } from 'naive-ui'
import { AddOutline, FilterOutline } from '@vicons/ionicons5'
import { PartsTable } from '@widgets/parts-table'
import { PartsFilter } from '@features/part/filter-parts'
import { CreatePartForm } from '@features/part/create-part'
import { EditPartForm } from '@features/part/edit-part'
import { usePartStore } from '@entities/part'

const partStore = usePartStore()

const showFilter = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingPartId = ref<number | null>(null)

onMounted(() => {
  partStore.loadParts()
})

function handleCreate() {
  showCreateModal.value = true
}

function handleCreateSuccess() {
  showCreateModal.value = false
  partStore.loadParts()
}

function handleEdit(id: number) {
  editingPartId.value = id
  showEditModal.value = true
}

function handleEditSuccess() {
  showEditModal.value = false
  editingPartId.value = null
  partStore.loadParts()
}
</script>

<style scoped>
.parts-list-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  margin-top: 16px;
}
</style>
