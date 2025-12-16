<template>
    <div class="space-y-4 max-w-3xl w-full mx-auto">
        <preview-photos
            v-if="showPreview"
            :photos="allPhotos"
            :start-index="currentValue"
            @close="showPreview = false"
        />

        <div v-if="pictures.length > 0 || previewImages.length > 0" class="w-full space-y-3">
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
                        <button
                            @click.stop="showDeleteConfirmation(picture.id)"
                            class="absolute right-3 top-3 rounded-full bg-black/65 p-2 text-white shadow-lg backdrop-blur hover:bg-black"
                        >
                            <TrashIcon class="h-5 w-5" />
                        </button>
                    </div>
                    <div
                        v-for="(img, idx) in previewImages"
                        :key="'preview-' + idx"
                        class="panel relative w-full cursor-pointer bg-slate-900"
                        @click="openPreview(pictures.length + idx)"
                    >
                        <div class="relative mx-auto aspect-[16/9] max-h-[460px] w-full">
                            <img
                                alt="Новое фото"
                                loading="lazy"
                                class="h-full w-full object-contain bg-slate-900"
                                :src="img"
                            />
                        </div>
                    </div>
                </Flicking>
                <div class="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent"></div>
                <div class="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-900 via-slate-900/60 to-transparent"></div>
                <div>
                    <ChevronLeftIcon
                        @click="prev"
                        class="absolute left-4 top-1/2 z-10 h-9 w-9 -translate-y-1/2 cursor-pointer rounded-full bg-white/90 p-2 text-slate-700 shadow-md backdrop-blur hover:bg-white"
                    />
                    <ChevronRightIcon
                        @click="next"
                        class="absolute right-4 top-1/2 z-10 h-9 w-9 -translate-y-1/2 cursor-pointer rounded-full bg-white/90 p-2 text-slate-700 shadow-md backdrop-blur hover:bg-white"
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
                        class="mx-1 cursor-pointer overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-sm"
                    >
                        <div class="relative h-[82px] w-full">
                            <img
                                loading="lazy"
                                class="absolute inset-0 h-full w-full object-cover"
                                :src="product.image"
                            />
                            <div
                                v-if="currentValue == index"
                                class="absolute inset-0 ring-2 ring-indigo-500"
                            />
                        </div>
                    </div>
                    <div
                        v-for="(img, idx) in previewImages"
                        :key="'preview-thumb-' + idx"
                        @click="currentValue = pictures.length + idx"
                        class="mx-1 cursor-pointer overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-sm"
                    >
                        <div class="relative h-[82px] w-full">
                            <img
                                loading="lazy"
                                class="absolute inset-0 h-full w-full object-cover"
                                :src="img"
                            />
                            <div
                                v-if="currentValue == pictures.length + idx"
                                class="absolute inset-0 ring-2 ring-indigo-500"
                            />
                        </div>
                    </div>
                </Flicking>
            </div>
        </div>
        <div v-else class="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-slate-500">
            Нету фотографий
        </div>

        <div class="w-full">
            <div
                class="relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-center text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50/60"
                @click="triggerFileInput"
            >
                <p class="text-base font-semibold text-slate-900">Загрузить фотографии</p>
                <p class="text-sm text-slate-500">Перетащите файлы или кликните, чтобы выбрать</p>
                <n-button secondary round>Выбрать файлы</n-button>
                <input
                    id="file-upload"
                    ref="fileInputRef"
                    type="file"
                    class="hidden"
                    @change="addPictures"
                    accept="image/*"
                    multiple
                />
            </div>
            <div v-if="selectedFileNames.length" class="mt-3 rounded-2xl border border-slate-200 bg-white p-3 text-slate-700">
                <p class="mb-2 text-sm font-semibold">Выбранные файлы:</p>
                <div class="flex flex-wrap gap-2">
                    <span
                        v-for="name in selectedFileNames"
                        :key="name"
                        class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                        {{ name }}
                    </span>
                </div>
                <div class="mt-3 flex gap-2">
                    <n-button :loading="isLoadingUploadPicture" type="primary" round @click="confirmUpload">Сохранить</n-button>
                    <n-button quaternary round @click="clearSelected">Очистить</n-button>
                </div>
            </div>
        </div>
        <!-- Модальное окно для подтверждения удаления -->
        <n-modal v-model:show="showModal" title="Подтверждение удаления">
            <template #default>
                <n-card class="!w-[400px]">
                    <div>
                        Вы уверены, что хотите удалить это изображение?
                    </div>
                    <div class="gap-2 flex mt-4">
                        <n-button :loading="isLoadingRemovePicture" @click="confirmDelete" type="error">Удалить</n-button>
                        <n-button @click="cancelDelete">Отмена</n-button>
                    </div>
                </n-card>
            </template>
            <template #action>

            </template>
        </n-modal>
    </div>
</template>

<script setup lang="ts">
import Flicking from "@egjs/vue3-flicking";
import PreviewPhotos from '@/components/PreviewPhotos.vue';
import { ref, watchEffect, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { NModal, NButton, NCard, useMessage } from "naive-ui";
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
const isLoadingUploadPicture = ref<boolean>(false);
const showModal = ref(false); // Отвечает за отображение модального окна
const pictureToDelete = ref<number | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const selectedFileNames = ref<string[]>([]);
const selectedFiles = ref<File[]>([]);
const previewImages = ref<string[]>([]);
const showPreview = ref(false)
const previewStartIndex = ref(0)
const allPhotos = computed(() => [
    ...props.pictures.map(p => ({ src: p.image, name: p.image?.split('/').pop() || '' })),
    ...previewImages.value.map(src => ({ src, name: src.split('/').pop() || 'preview' }))
])

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
        }
        catch (e) {

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


// Функция для добавления изображения
function addPictures(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files) return;
    selectedFiles.value = Array.from(files);
    selectedFileNames.value = selectedFiles.value.map(file => file.name);

    // Генерируем превью для выбранных файлов
    previewImages.value = [];
    selectedFiles.value.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            if (e.target?.result) {
                previewImages.value.push(e.target.result as string);
            }
        };
        reader.readAsDataURL(file);
    });
}

// Отмена удаления
function cancelDelete() {
    closeDeleteModal();
}

// Закрытие модального окна
function closeDeleteModal() {
    pictureToDelete.value = null;
    showModal.value = false;
}

// Подтверждение удаления изображения
function confirmDelete() {
    if (pictureToDelete.value !== null) {
        const index = props.pictures.findIndex(picture => picture.id === pictureToDelete.value);
        if (index !== -1) {
            isLoadingRemovePicture.value = true;
            axiosIns.delete(`/api/admin/product/image/${props.pictures[index].id}/`)
                .then((_) => {
                    message.success('Изображение удалено');
                    props.pictures.splice(index, 1);
                })
                .catch(e => {
                    message.error('Ошибка при удалении ' + e.toString());
                })
                .finally(() => {
                    isLoadingRemovePicture.value = false;
                    closeDeleteModal();
                })
        }
    }
}

function triggerFileInput() {
    fileInputRef.value?.click();
}

const confirmUpload = async () => {
    if (!selectedFiles.value.length) {
        message.error('Пожалуйста, выберите файлы для загрузки.')
        return
    }

    const formData = new FormData()
    formData.append('product', props.product_id.toString())
    selectedFiles.value.forEach(file => {
        formData.append('image', file)
    })

    try {
        isLoadingUploadPicture.value = true;
        await axiosIns.post('/api/admin/product/image/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'accept': 'application/json'
            }
        })
        message.success('Фотографии успешно загружены!');
        selectedFiles.value = [];
        selectedFileNames.value = [];
        previewImages.value = [];
        await reloadPictures(); // Подгружаем актуальные фотографии после загрузки
    } catch (error) {
        message.error('Ошибка при загрузке фотографий.')
    } finally {
        isLoadingUploadPicture.value = false;
    }
}

// Функция для подгрузки актуальных фотографий после загрузки
async function reloadPictures() {
    try {
        const res = await axiosIns.get(`/api/v2/product/${props.product_id}/`);
        // product.pictures должен быть реактивным, если pictures — prop, то нужно эмитить событие или использовать v-model
        // Если pictures — prop, обновляем массив по ссылке:
        if (Array.isArray(props.pictures)) {
            props.pictures.splice(0, props.pictures.length, ...res.data.pictures);
        }
    } catch (e) {
        message.error('Ошибка при обновлении фотографий');
    }
}

function openPreview(idx: number) {
    previewStartIndex.value = idx
    currentValue.value = idx
    showPreview.value = true
}

function clearSelected() {
    selectedFiles.value = [];
    selectedFileNames.value = [];
    previewImages.value = [];
}
</script>

<style scoped>
.panel {
    width: 100%;
    min-width: 100%;
}
</style>
