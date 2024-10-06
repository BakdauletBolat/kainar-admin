<template>
    <div>
        <n-card title="Загрузка фотографий" class="max-w-2xl mx-auto">
            <n-form>
                <n-form-item label="Загрузите фотографии">
                    <input type="file" @change="handleFileChange" multiple accept="image/*" />
                </n-form-item>
                <n-form-item>
                    <n-button type="primary" @click="uploadImages">Загрузить</n-button>
                </n-form-item>
            </n-form>
            <div class="mt-4 grid grid-cols-3 gap-4">
                <div v-for="(image, index) in imagePreviews" :key="index" class="relative">
                    <img :src="image" alt="Предварительный просмотр изображения"
                        class="object-cover w-full h-32 rounded-lg shadow" />
                </div>
            </div>
        </n-card>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useMessage, NForm, NFormItem, NButton, NCard } from 'naive-ui'
import axiosIns from '@/apis';

const selectedFiles = ref([])
const imagePreviews = ref([])

const message = useMessage()

const handleFileChange = (event) => {
    selectedFiles.value = event.target.files
    imagePreviews.value = []

    for (let i = 0; i < selectedFiles.value.length; i++) {
        const file = selectedFiles.value[i]
        const reader = new FileReader()

        reader.onload = (e) => {
            imagePreviews.value.push(e.target.result)
        }

        reader.readAsDataURL(file)
    }
}

const uploadImages = async () => {
    if (selectedFiles.value.length === 0) {
        message.error('Пожалуйста, выберите файлы для загрузки.')
        return
    }

    const formData = new FormData()
    formData.append('product', '14548212') // Добавление идентификатора продукта

    for (let i = 0; i < selectedFiles.value.length; i++) {
        formData.append('image[]', selectedFiles.value[i])
    }

    try {
        const response = await axiosIns.post('/api/product/image/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'accept': 'application/json'
            }
        })
        message.success('Фотографии успешно загружены!')
    } catch (error) {
        message.error('Ошибка при загрузке фотографий.')
    }
}
</script>

<style scoped>
/* Стили */
</style>