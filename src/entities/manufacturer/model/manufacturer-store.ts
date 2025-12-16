/**
 * Manufacturer Store
 * State management для производителей
 *
 * МИГРИРУЕТ: src/stores/manufacturer-store.ts
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { manufacturerApi } from '../api/manufacturer-api'
import { groupManufacturersByLetter, manufacturersToOptions } from '../lib/manufacturer-utils'
import type { Manufacturer, ManufacturerOption, ManufacturersByLetter } from './manufacturer-types'

export const useManufacturerStore = defineStore('manufacturer', () => {
  // ================ STATE ================

  /**
   * Список производителей
   */
  const manufacturers = ref<Manufacturer[]>([])

  /**
   * Текущий производитель
   */
  const manufacturer = ref<Manufacturer | null>(null)

  /**
   * Производители для поиска
   */
  const searchManufacturers = ref<Manufacturer[]>([])

  /**
   * Флаг загрузки
   */
  const isLoading = ref(false)

  // ================ GETTERS ================

  /**
   * Группировка производителей по первой букве
   */
  const manufacturersByLetter = computed<ManufacturersByLetter>(() => {
    return groupManufacturersByLetter(manufacturers.value)
  })

  /**
   * Производители в виде опций для Select
   */
  const manufacturerOptions = computed<ManufacturerOption[]>(() => {
    return manufacturersToOptions(manufacturers.value)
  })

  /**
   * Проверка наличия производителей
   */
  const hasManufacturers = computed(() => {
    return manufacturers.value.length > 0
  })

  // ================ ACTIONS ================

  /**
   * Загрузить список производителей
   */
  async function loadManufacturers() {
    isLoading.value = true

    try {
      const response = await manufacturerApi.getList()
      manufacturers.value = response.results
      return response.results
    } catch (error) {
      console.error('Failed to load manufacturers:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Загрузить одного производителя по ID
   */
  async function loadManufacturerById(id: number) {
    isLoading.value = true

    try {
      const man = await manufacturerApi.getById(id)
      manufacturer.value = man
      return man
    } catch (error) {
      console.error('Failed to load manufacturer:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Создать производителя
   */
  async function createManufacturer(data: Partial<Manufacturer>) {
    try {
      const newManufacturer = await manufacturerApi.create(data)
      manufacturers.value.push(newManufacturer)
      return newManufacturer
    } catch (error) {
      console.error('Failed to create manufacturer:', error)
      throw error
    }
  }

  /**
   * Обновить производителя
   */
  async function updateManufacturer(id: number, data: Partial<Manufacturer>) {
    try {
      const updatedManufacturer = await manufacturerApi.update(id, data)

      const index = manufacturers.value.findIndex(m => m.id === id)
      if (index !== -1) {
        manufacturers.value[index] = updatedManufacturer
      }

      if (manufacturer.value && manufacturer.value.id === id) {
        manufacturer.value = updatedManufacturer
      }

      return updatedManufacturer
    } catch (error) {
      console.error('Failed to update manufacturer:', error)
      throw error
    }
  }

  /**
   * Удалить производителя
   */
  async function deleteManufacturer(id: number) {
    try {
      await manufacturerApi.delete(id)
      manufacturers.value = manufacturers.value.filter(m => m.id !== id)

      if (manufacturer.value && manufacturer.value.id === id) {
        manufacturer.value = null
      }
    } catch (error) {
      console.error('Failed to delete manufacturer:', error)
      throw error
    }
  }

  /**
   * Сбросить state
   */
  function resetState() {
    manufacturers.value = []
    manufacturer.value = null
    searchManufacturers.value = []
    isLoading.value = false
  }

  // ================ RETURN ================

  return {
    // State
    manufacturers,
    manufacturer,
    searchManufacturers,
    isLoading,

    // Getters
    manufacturersByLetter,
    manufacturerOptions,
    hasManufacturers,

    // Actions
    loadManufacturers,
    loadManufacturerById,
    createManufacturer,
    updateManufacturer,
    deleteManufacturer,
    resetState
  }
})
