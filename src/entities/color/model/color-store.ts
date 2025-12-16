/**
 * Color Store
 * State management для цветов
 *
 * МИГРИРУЕТ: src/stores/color-store.ts
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { colorApi } from '../api/color-api'
import type { Color, ColorOption } from './color-types'

export const useColorStore = defineStore('color', () => {
  // ================ STATE ================

  /**
   * Список цветов
   */
  const colors = ref<Color[]>([])

  /**
   * Флаг загрузки
   */
  const isLoading = ref(false)

  // ================ GETTERS ================

  /**
   * Цвета в виде опций для Select
   */
  const colorOptions = computed<ColorOption[]>(() => {
    return colors.value.map(color => ({
      label: color.name,
      value: color.id
    }))
  })

  /**
   * Проверка наличия цветов
   */
  const hasColors = computed(() => {
    return colors.value.length > 0
  })

  // ================ ACTIONS ================

  /**
   * Загрузить список цветов
   */
  async function loadColors() {
    isLoading.value = true

    try {
      const response = await colorApi.getList()
      colors.value = response.results
      return response.results
    } catch (error) {
      console.error('Failed to load colors:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Создать цвет
   */
  async function createColor(data: Partial<Color>) {
    try {
      const newColor = await colorApi.create(data)
      colors.value.push(newColor)
      return newColor
    } catch (error) {
      console.error('Failed to create color:', error)
      throw error
    }
  }

  /**
   * Обновить цвет
   */
  async function updateColor(id: number, data: Partial<Color>) {
    try {
      const updatedColor = await colorApi.update(id, data)
      const index = colors.value.findIndex(c => c.id === id)
      if (index !== -1) {
        colors.value[index] = updatedColor
      }
      return updatedColor
    } catch (error) {
      console.error('Failed to update color:', error)
      throw error
    }
  }

  /**
   * Удалить цвет
   */
  async function deleteColor(id: number) {
    try {
      await colorApi.delete(id)
      colors.value = colors.value.filter(c => c.id !== id)
    } catch (error) {
      console.error('Failed to delete color:', error)
      throw error
    }
  }

  /**
   * Сбросить state
   */
  function resetState() {
    colors.value = []
    isLoading.value = false
  }

  // ================ RETURN ================

  return {
    // State
    colors,
    isLoading,

    // Getters
    colorOptions,
    hasColors,

    // Actions
    loadColors,
    createColor,
    updateColor,
    deleteColor,
    resetState
  }
})
