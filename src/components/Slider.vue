<template>
    <div v-if="pictures.length > 0" class="w-full flex flex-col gap-3">
        <div class="w-full relative">
            <Flicking @changed="onChange" class="rounded-sm" ref="flicking" :options="{
                preventClickOnDrag: true,
                duration: 100
            }">
                <div :key="picture.id" v-for="picture in pictures"
                    class="panel relative border-b cursor-pointer w-full h-[300px]">
                    <img alt="s" loading="lazy" class="w-full pointer-events-none h-full object-cover"
                        :src="picture.image" />
                    <button @click="showDeleteConfirmation(picture.id)"
                        class="absolute top-2 right-2 bg-red-500 text-white p-1 rounded">
                        <TrashIcon class="text-white w-6 h-6"></TrashIcon>
                    </button>
                </div>
            </Flicking>
            <div>
                <ChevronLeftIcon @click="prev" class="absolute z-10 top-1/2 cursor-pointer w-7 h-7"></ChevronLeftIcon>
                <ChevronRightIcon @click="next" class="absolute z-10 top-1/2 right-0 w-7 h-7 cursor-pointer">
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
            </Flicking>
        </div>
    </div>
    <div v-else>
        Нету фотографий
    </div>

    <div class="w-full mt-4">
        <label for="file-upload"
            class="cursor-pointer inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Загрузить фотографию
        </label>
        <input id="file-upload" type="file" class="hidden" @change="addPicture" accept="image/*" />
        <div v-if="selectedFileName" class="mt-2 text-gray-600">Выбранный файл: {{ selectedFileName }}</div>
    </div>
    <!-- Модальное окно для подтверждения удаления -->
    <n-modal v-model:show="showModal" title="Подтверждение удаления">
        <template #default>
            <n-card>
                <div>
                    Вы уверены, что хотите удалить это изображение?
                </div>
                <n-button @click="confirmDelete" type="error">Удалить</n-button>
                <n-button @click="cancelDelete">Отмена</n-button>
            </n-card>
        </template>
        <template #action>

        </template>
    </n-modal>
</template>

<script setup lang="ts">
import Flicking from "@egjs/vue3-flicking";
import { ref, watchEffect } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { NModal, NButton, NCard, useMessage } from "naive-ui";

const props = defineProps<{
    pictures: Picture[]
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
const selectedFileName = ref<string | null>(null);

const showModal = ref(false); // Отвечает за отображение модального окна
const pictureToDelete = ref<number | null>(null);

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

// Функция для удаления изображения
function removePicture(id: number) {
    const index = props.pictures.findIndex(picture => picture.id === id);
    if (index !== -1) {
        props.pictures.splice(index, 1);
    }
}
// Функция для добавления изображения
function addPicture(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        selectedFileName.value = file.name;
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            const newId = props.pictures.length > 0 ? props.pictures[props.pictures.length - 1].id + 1 : 1;
            const newPicture: Picture = {
                id: newId,
                image: e.target?.result as string,
            };
            props.pictures.push(newPicture);
        };
        reader.readAsDataURL(file);
    }
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
            props.pictures.splice(index, 1);
            message.success('Изображение удалено');
        }
    }
    closeDeleteModal();
}

</script>

<style scoped>
/* Стили */
</style>