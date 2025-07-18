<template>
    <div>
        <preview-photos
            v-if="showPreview"
            :photos="allPhotos"
            :start-index="currentValue"
            @close="showPreview = false"
        />
        <div v-if="pictures.length > 0 || previewImages.length > 0" class="w-full flex flex-col gap-3">
            <div class="w-full relative">
                <Flicking @changed="onChange" class="rounded-sm" ref="flicking" :options="{
                    preventClickOnDrag: true,
                    duration: 100
                }">
                    <div :key="picture.id" v-for="(picture, idx) in pictures"
                        class="panel relative border-b cursor-pointer w-full h-[300px]"
                        @click="openPreview(idx)">
                        <img alt="s" loading="lazy" class="w-full pointer-events-none h-full object-cover"
                            :src="picture.image" />
                        <button @click.stop="showDeleteConfirmation(picture.id)"
                            class="absolute top-2 right-2 bg-black text-white p-1 rounded">
                            <TrashIcon class="text-white w-6 h-6"></TrashIcon>
                        </button>
                    </div>
                    <div v-for="(img, idx) in previewImages" :key="'preview-' + idx"
                        class="panel relative border-b cursor-pointer w-full h-[300px]"
                        @click="openPreview(pictures.length + idx)">
                        <img alt="preview" loading="lazy" class="w-full pointer-events-none h-full object-cover"
                            :src="img" />
                    </div>
                </Flicking>
                <div>
                    <ChevronLeftIcon @click="prev" class="absolute z-10 -left-6 top-1/2 cursor-pointer w-7 h-7"></ChevronLeftIcon>
                    <ChevronRightIcon @click="next" class="absolute z-10 top-1/2 -right-6 w-7 h-7 cursor-pointer">
                    </ChevronRightIcon>
                </div>
            </div>
            <div class="w-full">
                <Flicking ref="flicking2" :options="{
                    preventClickOnDrag: true,
                    panelsPerView: 3,
                    duration: 100,
                    bound: true,
                    align: 'center',
                }">
                    <div @click="currentValue = index" :key="product.id" v-for="(product, index) in pictures"
                        class="mx-1 rounded-sm border-b overflow-hidden cursor-pointer">
                        <div class="w-full h-[80px] relative">
                            <img loading="lazy" class="w-full absolute top-0 left-0 pointer-events-none h-full object-cover"
                                :src="product.image" />
                            <div v-if="currentValue == index" class="w-full h-full bg-black opacity-10 absolute top-0">
                            </div>
                        </div>
                    </div>
                    <div v-for="(img, idx) in previewImages" :key="'preview-thumb-' + idx"
                        @click="currentValue = pictures.length + idx"
                        class="mx-1 rounded-sm border-b overflow-hidden cursor-pointer">
                        <div class="w-full h-[80px] relative">
                            <img loading="lazy" class="w-full absolute top-0 left-0 pointer-events-none h-full object-cover"
                                :src="img" />
                            <div v-if="currentValue == pictures.length + idx" class="w-full h-full bg-black opacity-10 absolute top-0">
                            </div>
                        </div>
                    </div>
                </Flicking>
            </div>
        </div>
        <div v-else>
            Нету фотографий
        </div>

        <div class="w-full mt-4">
            <n-button
                v-if="!selectedFileNames.length"
                @click="triggerFileInput"
                type="primary"
                class="mb-2"
            >
                Загрузить фотографии
            </n-button>
            <input
                id="file-upload"
                ref="fileInputRef"
                type="file"
                class="hidden"
                @change="addPictures"
                accept="image/*"
                multiple
            />
            <div v-if="selectedFileNames.length" class="mt-2 text-gray-600">
                Выбранные файлы:
                <ul>
                    <li v-for="name in selectedFileNames" :key="name">{{ name }}</li>
                </ul>
            </div>
            <div class="mt-4" v-if="selectedFileNames.length">
                <n-button :loading="isLoadingUploadPicture" type="primary" @click="confirmUpload">Сохранить</n-button>
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
import { ref, watchEffect, computed } from 'vue';
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
</script>

<style scoped>
/* Стили */
</style>