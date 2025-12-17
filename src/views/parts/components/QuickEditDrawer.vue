<template>
  <n-drawer :show="show" width="600" placement="right" @update:show="emit('update:show', $event)">
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

        <!-- OEM коды - улучшенный интерфейс -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-700">ОЕМ / артикулы</label>
          <div class="space-y-2">
            <div
              v-for="(code, index) in codesList"
              :key="index"
              class="flex items-center gap-2"
            >
              <n-input
                v-model:value="codesList[index]"
                placeholder="Введите код"
                @update:value="markDirty('code')"
              >
                <template #prefix>
                  <n-icon :component="BarcodeOutline" class="text-slate-400" />
                </template>
              </n-input>
              <n-button
                quaternary
                circle
                type="error"
                @click="removeCode(index)"
              >
                <template #icon>
                  <n-icon :component="CloseOutline" />
                </template>
              </n-button>
            </div>
            <n-button
              dashed
              block
              @click="addCode"
            >
              <template #icon>
                <n-icon :component="AddOutline" />
              </template>
              Добавить код
            </n-button>
          </div>
        </div>

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

        <!-- Загрузка фото с preview -->
        <div class="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
          <div class="flex items-center justify-between">
            <p class="text-sm font-semibold text-slate-900">Новые фото</p>
            <n-button tertiary size="small" round @click="clearFiles" v-if="selectedFileNames.length">
              Очистить
            </n-button>
          </div>

          <!-- Preview загруженных фото -->
          <div v-if="previewImages.length > 0" class="grid grid-cols-2 gap-2">
            <div
              v-for="(preview, idx) in previewImages"
              :key="idx"
              class="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-white"
            >
              <img :src="preview" class="h-full w-full object-cover" />
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
              <button
                @click="removeFile(idx)"
                class="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 hover:bg-red-600"
              >
                <n-icon :component="CloseOutline" :size="16" />
              </button>
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p class="text-xs text-white truncate">{{ selectedFileNames[idx] }}</p>
              </div>
            </div>
          </div>

          <!-- Кнопка загрузки -->
          <div
            class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-6 text-center text-slate-600 transition hover:border-primary-400 hover:bg-primary-50/30"
            @click="triggerFileInput"
          >
            <n-icon :component="ImagesOutline" :size="32" class="text-slate-400" />
            <p class="text-sm font-semibold text-slate-900">Добавить фотографии</p>
            <p class="text-xs text-slate-500">Кликните для выбора файлов</p>
            <input
              ref="fileInputRef"
              type="file"
              class="hidden"
              @change="onFilesSelected"
              accept="image/*"
              multiple
            />
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
  NIcon,
  useMessage
} from 'naive-ui';
import {
  BarcodeOutline,
  CloseOutline,
  AddOutline,
  ImagesOutline
} from '@vicons/ionicons5';
import axiosIns from '@/shared/api/axios';
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

const form = reactive({
  name: '',
  price: null as number | null,
  statusValue: 1,
  color: '',
  defect: '',
  comment: ''
});

const codesList = ref<string[]>(['']);
const dirtyFields = ref<Set<string>>(new Set());
const isSaving = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);
const selectedFiles = ref<File[]>([]);
const selectedFileNames = ref<string[]>([]);
const previewImages = ref<string[]>([]);
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
    form.comment = val.comment || '';

    // Парсим коды в массив
    if (val.code) {
      if (Array.isArray(val.code)) {
        codesList.value = val.code.filter(Boolean);
      } else {
        codesList.value = String(val.code).split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
      }
    } else {
      codesList.value = [''];
    }

    if (codesList.value.length === 0) {
      codesList.value = [''];
    }

    dirtyFields.value.clear();
    clearFiles();
  },
  { immediate: true }
);

function markDirty(key: string) {
  dirtyFields.value.add(key);
}

function addCode() {
  codesList.value.push('');
  markDirty('code');
}

function removeCode(index: number) {
  if (codesList.value.length > 1) {
    codesList.value.splice(index, 1);
    markDirty('code');
  }
}

function triggerFileInput() {
  fileInputRef.value?.click();
}

function onFilesSelected(event: Event) {
  const files = (event.target as HTMLInputElement).files;
  if (!files) return;

  selectedFiles.value = Array.from(files);
  selectedFileNames.value = selectedFiles.value.map((f) => f.name);

  // Создаём preview для каждого файла
  previewImages.value = [];
  selectedFiles.value.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        previewImages.value.push(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  });
}

function removeFile(index: number) {
  selectedFiles.value.splice(index, 1);
  selectedFileNames.value.splice(index, 1);
  previewImages.value.splice(index, 1);

  // Очищаем input если удалили все файлы
  if (selectedFiles.value.length === 0 && fileInputRef.value) {
    fileInputRef.value.value = '';
  }
}

function clearFiles() {
  selectedFiles.value = [];
  selectedFileNames.value = [];
  previewImages.value = [];
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
        payload.code = codesList.value.filter(c => c.trim() !== '');
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
