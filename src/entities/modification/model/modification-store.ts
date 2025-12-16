/**
 * Modification Store
 * State management для модификаций автомобилей
 *
 * МИГРИРУЕТ: src/stores/modifications-store.ts
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { modificationApi } from '../api/modification-api'
import type { Modification, ModificationOption, ModificationFilters } from './modification-types'

export const useModificationStore = defineStore('modification', () => {
  // ================ STATE ================

  /**
   * Список модификаций
   */
  const modifications = ref<Modification[]>([])

  /**
   * Текущая модификация
   */
  const modification = ref<Modification | null>(null)

  /**
   * Флаг загрузки
   */
  const isLoading = ref(false)

  // ================ GETTERS ================

  /**
   * Модификации в виде опций для Select
   */
  const modificationOptions = computed<ModificationOption[]>(() => {
    return modifications.value.map(mod => ({
      label: mod.name,
      value: mod.id
    }))
  })

  /**
   * Проверка наличия модификаций
   */
  const hasModifications = computed(() => {
    return modifications.value.length > 0
  })

  // ================ ACTIONS ================

  /**
   * Загрузить список модификаций
   */
  async function loadModifications(filters: ModificationFilters = {}) {
    isLoading.value = true

    try {
      const response = await modificationApi.getList(filters)
      modifications.value = response.results
      return response.results
    } catch (error) {
      console.error('Failed to load modifications:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Загрузить модификации по модели автомобиля
   */
  async function loadModificationsByModelCar(modelCarId: number) {
    isLoading.value = true

    try {
      const response = await modificationApi.getByModelCar(modelCarId)
      modifications.value = response.results
      return response.results
    } catch (error) {
      console.error('Failed to load modifications by model car:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Загрузить одну модификацию по ID
   */
  async function loadModification(id: number) {
    isLoading.value = true

    try {
      const mod = await modificationApi.getById(id)
      modification.value = mod
      return mod
    } catch (error) {
      console.error('Failed to load modification:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Создать модификацию
   */
  async function createModification(data: Partial<Modification>) {
    try {
      const newModification = await modificationApi.create(data)
      modifications.value.push(newModification)
      return newModification
    } catch (error) {
      console.error('Failed to create modification:', error)
      throw error
    }
  }

  /**
   * Обновить модификацию
   */
  async function updateModification(id: number, data: Partial<Modification>) {
    try {
      const updatedModification = await modificationApi.update(id, data)

      const index = modifications.value.findIndex(m => m.id === id)
      if (index !== -1) {
        modifications.value[index] = updatedModification
      }

      if (modification.value && modification.value.id === id) {
        modification.value = updatedModification
      }

      return updatedModification
    } catch (error) {
      console.error('Failed to update modification:', error)
      throw error
    }
  }

  /**
   * Удалить модификацию
   */
  async function deleteModification(id: number) {
    try {
      await modificationApi.delete(id)
      modifications.value = modifications.value.filter(m => m.id !== id)

      if (modification.value && modification.value.id === id) {
        modification.value = null
      }
    } catch (error) {
      console.error('Failed to delete modification:', error)
      throw error
    }
  }

  /**
   * Сбросить state
   */
  function resetState() {
    modifications.value = []
    modification.value = null
    isLoading.value = false
  }

  // ================ RETURN ================

  return {
    // State
    modifications,
    modification,
    isLoading,

    // Getters
    modificationOptions,
    hasModifications,

    // Actions
    loadModifications,
    loadModificationsByModelCar,
    loadModification,
    createModification,
    updateModification,
    deleteModification,
    resetState
  }
})
