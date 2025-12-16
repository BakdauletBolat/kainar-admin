/**
 * Part Store
 * State management для запчастей
 *
 * МИГРИРУЕТ: src/stores/product-store.ts
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { partApi } from '../api/part-api'
import type { Part, PartFilters, PartListItem } from './part-types'

export const usePartStore = defineStore('part', () => {
  // ================ STATE ================

  /**
   * Список запчастей (для таблиц и списков)
   */
  const parts = ref<PartListItem[]>([])

  /**
   * Детальная информация о запчасти
   */
  const part = ref<Part | null>(null)

  /**
   * Общее количество запчастей (для пагинации)
   */
  const totalCount = ref(0)

  /**
   * Флаг загрузки
   */
  const isLoading = ref(false)

  /**
   * Текущие фильтры
   */
  const filters = ref<PartFilters>({})

  /**
   * Популярные запчасти (если потребуется)
   */
  const popularParts = ref<PartListItem[]>([])

  // ================ GETTERS ================

  /**
   * Проверка наличия активных фильтров
   */
  const hasFilters = computed(() => {
    return Object.keys(filters.value).length > 0
  })

  /**
   * Проверка наличия запчастей
   */
  const hasParts = computed(() => {
    return parts.value.length > 0
  })

  // ================ ACTIONS ================

  /**
   * Загрузить список запчастей с фильтрами
   */
  async function loadParts(newFilters?: PartFilters) {
    isLoading.value = true

    try {
      // Объединяем существующие фильтры с новыми
      if (newFilters) {
        filters.value = { ...filters.value, ...newFilters }
      }

      const response = await partApi.getList(filters.value)

      parts.value = response.results
      totalCount.value = response.count

      return response
    } catch (error) {
      console.error('Failed to load parts:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Загрузить одну запчасть по ID
   */
  async function loadPart(id: string | number) {
    isLoading.value = true

    try {
      part.value = await partApi.getById(id)
      return part.value
    } catch (error) {
      console.error('Failed to load part:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Создать новую запчасть
   */
  async function createPart(data: Partial<Part>) {
    try {
      const newPart = await partApi.create(data)
      // Перезагрузить список после создания
      await loadParts()
      return newPart
    } catch (error) {
      console.error('Failed to create part:', error)
      throw error
    }
  }

  /**
   * Обновить запчасть
   */
  async function updatePart(id: number, data: Partial<Part>) {
    try {
      const updatedPart = await partApi.update(id, data)

      // Обновить в списке если есть
      const index = parts.value.findIndex(p => p.id === id)
      if (index !== -1) {
        // Обновляем только если это PartListItem
        // Если нужны все поля, перезагрузить список
        await loadParts()
      }

      // Обновить детальную информацию если открыта
      if (part.value && part.value.id === id) {
        part.value = updatedPart
      }

      return updatedPart
    } catch (error) {
      console.error('Failed to update part:', error)
      throw error
    }
  }

  /**
   * Удалить одну запчасть
   */
  async function deletePart(id: number | string) {
    try {
      await partApi.bulkDelete([Number(id)])

      // Обновить список после удаления
      await loadParts()
    } catch (error) {
      console.error('Failed to delete part:', error)
      throw error
    }
  }

  /**
   * Массовое удаление запчастей
   */
  async function bulkDelete(ids: number[]) {
    try {
      await partApi.bulkDelete(ids)

      // Обновить список после удаления
      await loadParts()
    } catch (error) {
      console.error('Failed to delete parts:', error)
      throw error
    }
  }

  /**
   * Alias для bulkDelete для совместимости
   */
  const bulkDeleteParts = bulkDelete

  /**
   * Alias для loadPart для совместимости
   */
  const loadPartById = loadPart

  /**
   * Загрузить изображение для запчасти
   */
  async function uploadPartImage(id: number | string, formData: FormData) {
    try {
      const files = formData.getAll('image') as File[]
      await partApi.uploadImages(Number(id), files)

      // Перезагрузить запчасть чтобы получить обновленные изображения
      await loadPart(id)
    } catch (error) {
      console.error('Failed to upload part image:', error)
      throw error
    }
  }

  /**
   * Удалить изображение запчасти
   * TODO: Добавить API метод когда будет готов
   */
  async function deletePartImage(partId: number | string, _imageId: number) {
    try {
      // await partApi.deleteImage(partId, _imageId)
      console.warn('deletePartImage not implemented yet')

      // Перезагрузить запчасть
      await loadPart(partId)
    } catch (error) {
      console.error('Failed to delete part image:', error)
      throw error
    }
  }

  /**
   * Очистить все фильтры
   */
  function clearFilters() {
    filters.value = {}
  }

  /**
   * Установить конкретный фильтр
   */
  function setFilter(key: keyof PartFilters, value: any) {
    filters.value = {
      ...filters.value,
      [key]: value
    }
  }

  /**
   * Сбросить весь state
   */
  function resetState() {
    parts.value = []
    part.value = null
    totalCount.value = 0
    filters.value = {}
    isLoading.value = false
    popularParts.value = []
  }

  // ================ RETURN ================

  return {
    // State
    parts,
    part,
    totalCount,
    isLoading,
    filters,
    popularParts,

    // Getters
    hasFilters,
    hasParts,

    // Actions
    loadParts,
    loadPart,
    loadPartById,
    createPart,
    updatePart,
    deletePart,
    bulkDelete,
    bulkDeleteParts,
    uploadPartImage,
    deletePartImage,
    clearFilters,
    setFilter,
    resetState
  }
})
