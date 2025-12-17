<template>
  <div class="max-w-3xl w-full mx-auto">
    <preview-photos
      v-if="showPreview"
      :photos="allPhotos"
      :start-index="currentValue"
      @close="showPreview = false"
    />

    <div v-if="pictures.length > 0" class="w-full space-y-3">
      <div class="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-slate-900">
        <Flicking
          @changed="onChange"
          class="rounded-3xl"
          ref="flicking"
          :options="{
            preventClickOnDrag: true,
            duration: 120
          }"
        >
          <div
            :key="picture.id"
            v-for="(picture, idx) in pictures"
            class="panel relative w-full cursor-pointer bg-slate-900"
            @click="openPreview(idx)"
          >
            <div class="relative mx-auto aspect-[16/9] max-h-[460px] w-full">
              <img
                alt="Фото детали"
                loading="lazy"
                class="h-full w-full object-contain bg-slate-900"
                :src="picture.image"
              />
            </div>
            <!-- Красивая кнопка удаления -->
            <button
              @click.stop="showDeleteConfirmation(picture.id)"
              class="group/btn absolute right-4 top-4 flex items-center gap-2 rounded-full bg-red-500/90 px-3 py-2 text-white shadow-lg backdrop-blur transition-all hover:bg-red-600 hover:shadow-xl hover:scale-105"
            >
              <TrashIcon class="h-4 w-4" />
              <span class="text-sm font-medium">Удалить</span>
            </button>
          </div>
        </Flicking>
        <div class="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent"></div>
        <div class="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-900 via-slate-900/60 to-transparent"></div>
        <div>
          <ChevronLeftIcon
            @click="prev"
            class="absolute left-4 top-1/2 z-10 h-10 w-10 -translate-y-1/2 cursor-pointer rounded-full bg-white/95 p-2.5 text-slate-700 shadow-lg backdrop-blur transition-all hover:bg-white hover:scale-110"
          />
          <ChevronRightIcon
            @click="next"
            class="absolute right-4 top-1/2 z-10 h-10 w-10 -translate-y-1/2 cursor-pointer rounded-full bg-white/95 p-2.5 text-slate-700 shadow-lg backdrop-blur transition-all hover:bg-white hover:scale-110"
          />
        </div>
      </div>

      <div class="w-full">
        <Flicking
          ref="flicking2"
          :options="{
            preventClickOnDrag: true,
            panelsPerView: 4,
            duration: 120,
            bound: true,
            align: 'center',
          }"
        >
          <div
            @click="currentValue = index"
            :key="product.id"
            v-for="(product, index) in pictures"
            class="mx-1 cursor-pointer overflow-hidden rounded-xl border-2 transition-all"
            :class="currentValue == index ? 'border-primary-500 shadow-md' : 'border-slate-200/70 hover:border-slate-300'"
          >
            <div class="relative h-[82px] w-full">
              <img
                loading="lazy"
                class="absolute inset-0 h-full w-full object-cover"
                :src="product.image"
              />
              <div
                v-if="currentValue == index"
                class="absolute inset-0 bg-primary-500/10"
              />
            </div>
          </div>
        </Flicking>
      </div>
    </div>

    <!-- Пустое состояние -->
    <div v-else class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-12 text-center">
      <n-icon :component="ImageOutline" :size="48" class="mb-3 text-slate-400" />
      <p class="text-sm font-semibold text-slate-700">Нет фотографий</p>
      <p class="text-xs text-slate-500 mt-1">Добавьте фотографии через кнопку "Редактировать"</p>
    </div>

    <!-- Модальное окно подтверждения удаления -->
    <n-modal v-model:show="showModal">
      <n-card class="!w-[440px]" title="Удалить фотографию?" :bordered="false" size="large">
        <div class="space-y-4">
          <p class="text-slate-600">Вы уверены, что хотите удалить это изображение? Это действие нельзя отменить.</p>

          <div class="flex gap-2 justify-end">
            <n-button @click="cancelDelete" round>Отмена</n-button>
            <n-button
              :loading="isLoadingRemovePicture"
              @click="confirmDelete"
              type="error"
              round
            >
              Удалить
            </n-button>
          </div>
        </div>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import Flicking from "@egjs/vue3-flicking";
import PreviewPhotos from '@/components/PreviewPhotos.vue';
import { ref, watchEffect, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { NModal, NCard, NIcon, NButton, useMessage } from "naive-ui";
import { ImageOutline } from '@vicons/ionicons5';
import axiosIns from "@/apis";

const props = defineProps<{
  pictures: Picture[],
  product_id: number
}>();

type ChangedValue = {
  index: number;
}

type Picture = {
  id: number;
  image: string;
}

const currentValue = ref(0);
const message = useMessage();

const flicking = ref<Flicking | null>(null);
const flicking2 = ref<Flicking | null>(null);
const isLoadingRemovePicture = ref<boolean>(false);
const showModal = ref(false);
const pictureToDelete = ref<number | null>(null);
const showPreview = ref(false);
const previewStartIndex = ref(0);

const allPhotos = computed(() =>
  props.pictures.map(p => ({ src: p.image, name: p.image?.split('/').pop() || '' }))
);

function resizeFlicking() {
  nextTick(() => {
    flicking.value?.resize();
    flicking2.value?.resize();
  });
}

watchEffect(() => {
  if (flicking.value != null && flicking2.value != null) {
    try {
      flicking.value!.moveTo(currentValue.value);
      flicking2.value!.moveTo(currentValue.value);
    } catch (e) {
      // Игнорируем ошибки при переключении
    }
  }
});

onMounted(() => {
  window.addEventListener('resize', resizeFlicking);
  resizeFlicking();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeFlicking);
});

function onChange(changed: ChangedValue) {
  currentValue.value = changed.index;
}

function next() {
  if (currentValue.value >= props.pictures.length - 1) {
    return;
  }
  currentValue.value += 1;
}

function prev() {
  if (currentValue.value <= 0) {
    return;
  }
  currentValue.value -= 1;
}

function showDeleteConfirmation(id: number) {
  pictureToDelete.value = id;
  showModal.value = true;
}

function cancelDelete() {
  closeDeleteModal();
}

function closeDeleteModal() {
  pictureToDelete.value = null;
  showModal.value = false;
}

function confirmDelete() {
  if (pictureToDelete.value !== null) {
    const index = props.pictures.findIndex(picture => picture.id === pictureToDelete.value);
    if (index !== -1) {
      isLoadingRemovePicture.value = true;
      axiosIns.delete(`/api/admin/product/image/${props.pictures[index].id}/`)
        .then((_) => {
          message.success('Изображение удалено');
          props.pictures.splice(index, 1);
          // Корректируем currentValue если удалили текущее фото
          if (currentValue.value >= props.pictures.length) {
            currentValue.value = Math.max(0, props.pictures.length - 1);
          }
        })
        .catch(e => {
          message.error('Ошибка при удалении');
        })
        .finally(() => {
          isLoadingRemovePicture.value = false;
          closeDeleteModal();
        });
    }
  }
}

function openPreview(idx: number) {
  previewStartIndex.value = idx;
  currentValue.value = idx;
  showPreview.value = true;
}
</script>

<style scoped>
.panel {
  width: 100%;
  min-width: 100%;
}
</style>
