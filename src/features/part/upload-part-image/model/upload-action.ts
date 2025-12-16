/**
 * Upload Part Image Action
 * Действие загрузки изображения запчасти
 */

import { ref } from 'vue'
import { usePartStore } from '@entities/part'
import { useMessage } from 'naive-ui'
import type { UploadFileInfo } from 'naive-ui'

export function useUploadPartImage(partId: number | string) {
  const partStore = usePartStore()
  const message = useMessage()

  const isUploading = ref(false)

  async function handleUpload(file: UploadFileInfo) {
    if (!file.file) return

    const formData = new FormData()
    formData.append('image', file.file)

    isUploading.value = true
    try {
      await partStore.uploadPartImage(partId, formData)
      message.success('Изображение загружено')
      return true
    } catch (error) {
      message.error('Ошибка загрузки изображения')
      return false
    } finally {
      isUploading.value = false
    }
  }

  async function handleDelete(imageId: number) {
    try {
      await partStore.deletePartImage(partId, imageId)
      message.success('Изображение удалено')
      return true
    } catch (error) {
      message.error('Ошибка удаления изображения')
      return false
    }
  }

  return {
    isUploading,
    handleUpload,
    handleDelete
  }
}
