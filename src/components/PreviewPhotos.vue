<template>
  <div class="fixed inset-0 z-[999999] bg-black bg-opacity-90 flex flex-col">
    <div class="flex items-center justify-between px-6 py-4 text-white bg-black bg-opacity-70">
      <button @click="$emit('close')" class="focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
      <div class="flex-1 text-center truncate">
        {{ currentPhoto?.name }}
      </div>
      <div class="flex items-center gap-4 w-48 justify-end">
        <button
          v-if="currentPhoto?.src"
          @click="downloadCurrentPhoto"
          class="flex items-center gap-1 text-primary underline hover:text-primary-400"
          title="Скачать фото"
        >
          <DownloadIcon class="w-5 h-5" />
          Скачать
        </button>
        <span>{{ currentIndex + 1 }} / {{ photos.length }}</span>
      </div>
    </div>
    <div class="flex-1 flex items-center justify-center relative">
      <button
        @click="goTo(currentIndex - 1)"
        :disabled="currentIndex === 0"
        class="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-40 rounded-full p-2 text-white hover:bg-opacity-70"
      >
        <ChevronLeftIcon class="w-8 h-8" />
      </button>
      <Flicking
        ref="flickingRef"
        :options="{ horizontal: true, circular: false, duration: 200 }"
        :index="currentIndex"
        @changed="onFlick"
        class="w-full h-full"
      >
        <div
          v-for="(photo, idx) in photos"
          :key="photo.src"
          class="flex items-center justify-center w-full h-full"
        >
          <img :src="photo.src" :alt="photo.name" class="max-h-[80vh] max-w-full object-contain" />
        </div>
      </Flicking>
      <button
        @click="goTo(currentIndex + 1)"
        :disabled="currentIndex === photos.length - 1"
        class="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-40 rounded-full p-2 text-white hover:bg-opacity-70"
      >
        <ChevronRightIcon class="w-8 h-8" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Flicking from "@egjs/vue3-flicking";
import { ref, watch, onMounted, computed, nextTick } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline"
import { ArrowDownTrayIcon as DownloadIcon } from "@heroicons/vue/24/outline"

const props = defineProps<{
  photos: { src: string, name: string }[],
  startIndex?: number
}>()

const emit = defineEmits(['close'])

const flickingRef = ref<any>(null)
const currentIndex = ref(props.startIndex ?? 0)
const currentPhoto = computed(() => props.photos[currentIndex.value])

watch(() => props.startIndex, (val) => {
  if (typeof val === 'number') currentIndex.value = val
})

function goTo(idx: number) {
  if (idx < 0 || idx > props.photos.length - 1) return
  currentIndex.value = idx
  nextTick(() => {
    if (flickingRef.value) {
      flickingRef.value.moveTo(idx)
    }
  })
}

function onFlick(e: any) {
  currentIndex.value = e.index
}

function downloadCurrentPhoto() {
  if (!currentPhoto.value?.src) return;
  // Попробуем использовать fetch, если CORS не блокирует
  fetch(currentPhoto.value.src)
    .then(response => {
        console.log('Response received:', response);
        return response.blob()
    })
    .then(blob => {
      console.log('Blob created:', blob);
      const blobUrl = window.URL.createObjectURL(blob);
      triggerDownload(blobUrl, currentPhoto.value.name || 'photo.jpg');
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
    })
    .catch(() => {
      // Если fetch не сработал, пробуем создать временную ссылку с download
      triggerDownload(currentPhoto.value.src, currentPhoto.value.name || 'photo.jpg');
    });
}

function triggerDownload(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.setAttribute('download', filename);
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

onMounted(() => {
  if (typeof props.startIndex === 'number') currentIndex.value = props.startIndex
  nextTick(() => {
    if (flickingRef.value) {
      flickingRef.value.moveTo(currentIndex.value)
    }
  })
})
</script>

<style scoped>
/* Можно добавить стили для анимации и адаптива */
</style>
