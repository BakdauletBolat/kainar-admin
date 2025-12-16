<template>
  <n-drawer :show="show" width="520" placement="right" @update:show="emit('update:show', $event)">
    <n-drawer-content closable body-content-class="pb-24">
      <template #header>
        <div class="space-y-1">
          <p class="text-lg font-semibold text-slate-900">Редактировать запчасть</p>
          <p v-if="product?.name" class="text-sm text-slate-500">{{ product?.name }}</p>
        </div>
      </template>
      <n-form label-placement="top" class="space-y-4">
        <div class="rounded-2xl bg-slate-50 px-4 py-3">
          <n-form-item label="Название">
            <n-input v-model:value="form.name" placeholder="Введите название" @update:value="markDirty('name')" />
          </n-form-item>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <n-form-item label="Статус">
            <n-select
              v-model:value="form.statusValue"
              :options="statusOptions"
              @update:value="markDirty('status')"
              placeholder="Выберите статус"
            />
          </n-form-item>
          <n-form-item label="Цена, ₸">
            <n-input-number
              v-model:value="form.price"
              :min="0"
              :step="1000"
              class="w-full"
              placeholder="0"
              @update:value="markDirty('price')"
            />
          </n-form-item>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <n-form-item label="Цвет">
            <n-input v-model:value="form.color" placeholder="Укажите цвет" @update:value="markDirty('color')" />
          </n-form-item>
          <n-form-item label="Состояние">
            <n-input v-model:value="form.defect" placeholder="Например: б/у, царапина" @update:value="markDirty('defect')" />
          </n-form-item>
        </div>

        <n-form-item label="ОЕМ / артикулы (через запятую или строками)">
          <n-input
            type="textarea"
            v-model:value="form.code"
            @update:value="markDirty('code')"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="Например: 123456, ABC-789"
          />
        </n-form-item>

        <n-form-item label="Комментарий">
          <n-input
            type="textarea"
            v-model:value="form.comment"
            @update:value="markDirty('comment')"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="Добавьте примечание"
          />
        </n-form-item>

        <n-form-item label="Склад">
          <warehouse-component
            v-if="props.product?.warehouse"
            :warehouse="props.product.warehouse"
            view_mode="to_move"
            @onChangedProp="emit('move-warehouse', $event)"
          />
          <div v-else class="flex flex-col gap-2">
            <p class="text-sm text-slate-500">Склад не назначен</p>
            <warehouse-component
              :warehouse="{ id: null, name: 'Назначить склад' }"
              view_mode="to_move"
              @onChangedProp="emit('move-warehouse', $event)"
            />
          </div>
        </n-form-item>

        <div class="space-y-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4">
          <div class="flex items-center justify-between">
            <p class="text-sm font-semibold text-slate-900">Новые фото</p>
            <n-button tertiary size="small" round @click="clearFiles" v-if="selectedFileNames.length">Очистить</n-button>
          </div>
          <div
            class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-4 text-center text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50/60"
            @click="triggerFileInput"
          >
            <p class="text-sm font-semibold">Добавить файлы</p>
            <p class="text-xs text-slate-500">Перетащите или кликните для выбора</p>
            <n-button secondary round size="small">Выбрать</n-button>
            <input
              ref="fileInputRef"
              type="file"
              class="hidden"
              @change="onFilesSelected"
              accept="image/*"
              multiple
            />
          </div>
          <div v-if="selectedFileNames.length" class="flex flex-wrap gap-2">
            <span
              v-for="name in selectedFileNames"
              :key="name"
              class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
            >
              {{ name }}
            </span>
          </div>
        </div>

        <div class="flex gap-2 flex-col rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-[0_-6px_24px_-18px_rgba(15,23,42,0.35)]">
          <n-button quaternary block round @click="emit('update:show', false)">Отмена</n-button>
          <n-button type="primary" block round :loading="isSaving" @click="saveChanges">
            Сохранить изменения
          </n-button>
        </div>
      </n-form>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import {
  NDrawer,
  NDrawerContent,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSelect,
  NButton,
  useMessage
} from 'naive-ui';
import axiosIns from '@/apis';
import type { ProductDetail } from '@/apis/products';
import WarehouseComponent from '@/views/parts/ui/warehouse-component.vue';

const props = defineProps<{
  show: boolean;
  product: ProductDetail | null;
}>();

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void;
  (e: 'saved'): void;
  (e: 'move-warehouse', payload: any): void;
}>();

const statusOptions = [
  { label: 'Необработан', value: 1 },
  { label: 'В наличии', value: 2 },
  { label: 'Зарезервирован', value: 3 },
  { label: 'Удален', value: 4 },
  { label: 'Продан', value: 5 }
];

const statusValueFromLabel = (label?: string) => {
  const map: Record<string, number> = {
    'Необработан': 1,
    'В наличии': 2,
    'Зарезервирован': 3,
    'Удален': 4,
    'Продан': 5
  };
  return map[label || ''] || 1;
};

const formatCodesToString = (codes: any): string => {
  if (!codes) return '';
  if (Array.isArray(codes)) {
    return codes.filter(Boolean).join(', ');
  }
  return String(codes);
};

const form = reactive({
  name: '',
  price: null as number | null,
  statusValue: 1,
  color: '',
  defect: '',
  code: '',
  comment: ''
});

const dirtyFields = ref<Set<string>>(new Set());
const isSaving = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);
const selectedFiles = ref<File[]>([]);
const selectedFileNames = ref<string[]>([]);
const message = useMessage();

const productId = computed(() => props.product?.id);

watch(
  () => props.product,
  (val) => {
    if (!val) return;
    form.name = val.name || '';
    form.price = val.price ?? null;
    form.statusValue = statusValueFromLabel(val.status);
    form.color = val.color || '';
    form.defect = (val as any).defect || '';
    form.code = formatCodesToString(val.code);
    form.comment = val.comment || '';
    dirtyFields.value.clear();
    clearFiles();
  },
  { immediate: true }
);

function markDirty(key: string) {
  dirtyFields.value.add(key);
}

function triggerFileInput() {
  fileInputRef.value?.click();
}

function onFilesSelected(event: Event) {
  const files = (event.target as HTMLInputElement).files;
  if (!files) return;
  selectedFiles.value = Array.from(files);
  selectedFileNames.value = selectedFiles.value.map((f) => f.name);
}

function clearFiles() {
  selectedFiles.value = [];
  selectedFileNames.value = [];
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
}

async function saveChanges() {
  if (!productId.value) return;
  const payload: Record<string, any> = {};
  dirtyFields.value.forEach((key) => {
    switch (key) {
      case 'name':
        payload.name = form.name;
        break;
      case 'price':
        payload.price = form.price;
        break;
      case 'status':
        payload.status = form.statusValue;
        break;
      case 'color':
        payload.color = form.color;
        break;
      case 'defect':
        payload.defect = form.defect;
        break;
      case 'code':
        payload.code = form.code
          .split(/[\n,]+/)
          .map((item) => item.trim())
          .filter(Boolean);
        break;
      case 'comment':
        payload.comment = form.comment;
        break;
    }
  });

  if (!Object.keys(payload).length && !selectedFiles.value.length) {
    emit('update:show', false);
    return;
  }

  isSaving.value = true;
  try {
    if (Object.keys(payload).length) {
      await axiosIns.patch(`/api/admin/product/v2/product/${productId.value}/update/`, payload);
    }

    if (selectedFiles.value.length) {
      const formData = new FormData();
      formData.append('product', productId.value.toString());
      selectedFiles.value.forEach((file) => formData.append('image', file));
      await axiosIns.post('/api/admin/product/image/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          accept: 'application/json'
        }
      });
    }

    message.success('Изменения сохранены');
    emit('saved');
    emit('update:show', false);
    dirtyFields.value.clear();
    clearFiles();
  } catch (e: any) {
    message.error('Не удалось сохранить изменения');
  } finally {
    isSaving.value = false;
  }
}
</script>
