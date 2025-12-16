/**
 * ModelCar Store
 * State management для моделей автомобилей
 *
 * МИГРИРУЕТ: Часть src/stores/manufacturer-store.ts (modelCars)
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { modelCarApi } from '../api/model-car-api'
import type { ModelCar, ModelCarOption, ModelCarFilters } from './model-car-types'

export const useModelCarStore = defineStore('model-car', () => {
  // ================ STATE ================

  /**
   * Список моделей
   */
  const modelCars = ref<ModelCar[]>([])

  /**
   * Текущая модель
   */
  const modelCar = ref<ModelCar | null>(null)

  /**
   * Модели для поиска
   */
  const searchModelCars = ref<ModelCar[]>([])

  /**
   * Флаг загрузки
   */
  const isLoading = ref(false)

  // ================ GETTERS ================

  /**
   * Модели в виде опций для Select
   */
  const modelCarOptions = computed<ModelCarOption[]>(() => {
    return modelCars.value.map(model => ({
      label: model.name,
      value: model.id
    }))
  })

  /**
   * Проверка наличия моделей
   */
  const hasModelCars = computed(() => {
    return modelCars.value.length > 0
  })

  // ================ ACTIONS ================

  /**
   * Загрузить список моделей
   */
  async function loadModelCars(filters: ModelCarFilters = {}) {
    isLoading.value = true

    try {
      const response = await modelCarApi.getList(filters)
      modelCars.value = response.results
      return response.results
    } catch (error) {
      console.error('Failed to load model cars:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Загрузить модели по производителю
   */
  async function loadModelCarsByManufacturer(manufacturerId: number, pageSize = 1000) {
    isLoading.value = true

    try {
      const response = await modelCarApi.getByManufacturer(manufacturerId, pageSize)
      modelCars.value = response.results
      return response.results
    } catch (error) {
      console.error('Failed to load model cars by manufacturer:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Загрузить одну модель по ID
   */
  async function loadModelCarById(id: number) {
    isLoading.value = true

    try {
      const model = await modelCarApi.getById(id)
      modelCar.value = model
      return model
    } catch (error) {
      console.error('Failed to load model car:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Создать модель
   */
  async function createModelCar(data: Partial<ModelCar>) {
    try {
      const newModelCar = await modelCarApi.create(data)
      modelCars.value.push(newModelCar)
      return newModelCar
    } catch (error) {
      console.error('Failed to create model car:', error)
      throw error
    }
  }

  /**
   * Обновить модель
   */
  async function updateModelCar(id: number, data: Partial<ModelCar>) {
    try {
      const updatedModelCar = await modelCarApi.update(id, data)

      const index = modelCars.value.findIndex(m => m.id === id)
      if (index !== -1) {
        modelCars.value[index] = updatedModelCar
      }

      if (modelCar.value && modelCar.value.id === id) {
        modelCar.value = updatedModelCar
      }

      return updatedModelCar
    } catch (error) {
      console.error('Failed to update model car:', error)
      throw error
    }
  }

  /**
   * Удалить модель
   */
  async function deleteModelCar(id: number) {
    try {
      await modelCarApi.delete(id)
      modelCars.value = modelCars.value.filter(m => m.id !== id)

      if (modelCar.value && modelCar.value.id === id) {
        modelCar.value = null
      }
    } catch (error) {
      console.error('Failed to delete model car:', error)
      throw error
    }
  }

  /**
   * Сбросить state
   */
  function resetState() {
    modelCars.value = []
    modelCar.value = null
    searchModelCars.value = []
    isLoading.value = false
  }

  // ================ RETURN ================

  return {
    // State
    modelCars,
    modelCar,
    searchModelCars,
    isLoading,

    // Getters
    modelCarOptions,
    hasModelCars,

    // Actions
    loadModelCars,
    loadModelCarsByManufacturer,
    loadModelCarById,
    createModelCar,
    updateModelCar,
    deleteModelCar,
    resetState
  }
})
