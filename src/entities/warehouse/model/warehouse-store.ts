/**
 * Warehouse Store
 * State management для складов
 *
 * МИГРИРУЕТ: src/stores/warehouses-store.ts
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { warehouseApi } from '../api/warehouse-api'
import type { Warehouse, WarehouseListItem, WarehouseOption, WarehouseFilters } from './warehouse-types'

export const useWarehouseStore = defineStore('warehouse', () => {
  // ================ STATE ================

  /**
   * Список складов
   */
  const warehouses = ref<WarehouseListItem[]>([])

  /**
   * Детальная информация о складе
   */
  const warehouse = ref<Warehouse | null>(null)

  /**
   * Общее количество складов
   */
  const totalCount = ref(0)

  /**
   * Флаг загрузки
   */
  const isLoading = ref(false)

  // ================ GETTERS ================

  /**
   * Склады в виде опций для Select
   */
  const warehouseOptions = computed<WarehouseOption[]>(() => {
    return warehouses.value.map(wh => ({
      label: wh.name,
      value: wh.id
    }))
  })

  /**
   * Проверка наличия складов
   */
  const hasWarehouses = computed(() => {
    return warehouses.value.length > 0
  })

  // ================ ACTIONS ================

  /**
   * Загрузить список складов
   */
  async function loadWarehouses(filters: WarehouseFilters = {}) {
    isLoading.value = true

    try {
      const response = await warehouseApi.getList(filters)
      warehouses.value = response.results
      totalCount.value = response.count
      return response
    } catch (error) {
      console.error('Failed to load warehouses:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Загрузить один склад по ID
   */
  async function loadWarehouse(id: number | string) {
    isLoading.value = true

    try {
      const wh = await warehouseApi.getById(id)
      warehouse.value = wh
      return wh
    } catch (error) {
      console.error('Failed to load warehouse:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Создать склад
   */
  async function createWarehouse(data: Partial<Warehouse>) {
    try {
      const newWarehouse = await warehouseApi.create(data)
      // Перезагрузить список после создания
      await loadWarehouses()
      return newWarehouse
    } catch (error) {
      console.error('Failed to create warehouse:', error)
      throw error
    }
  }

  /**
   * Обновить склад
   */
  async function updateWarehouse(id: number | string, data: Partial<Warehouse>) {
    try {
      const updatedWarehouse = await warehouseApi.update(id, data)
      // Обновить текущий если это он
      if (warehouse.value && warehouse.value.id === id) {
        warehouse.value = updatedWarehouse
      }
      // Перезагрузить список
      await loadWarehouses()
      return updatedWarehouse
    } catch (error) {
      console.error('Failed to update warehouse:', error)
      throw error
    }
  }

  /**
   * Удалить склад
   */
  async function deleteWarehouse(id: number | string) {
    try {
      await warehouseApi.delete(id)
      // Удалить из списка
      warehouses.value = warehouses.value.filter(wh => wh.id !== id)
      totalCount.value = Math.max(0, totalCount.value - 1)
      // Очистить текущий если это он
      if (warehouse.value && warehouse.value.id === id) {
        warehouse.value = null
      }
    } catch (error) {
      console.error('Failed to delete warehouse:', error)
      throw error
    }
  }

  /**
   * Сбросить state
   */
  function resetState() {
    warehouses.value = []
    warehouse.value = null
    totalCount.value = 0
    isLoading.value = false
  }

  // ================ RETURN ================

  return {
    // State
    warehouses,
    warehouse,
    totalCount,
    isLoading,

    // Getters
    warehouseOptions,
    hasWarehouses,

    // Actions
    loadWarehouses,
    loadWarehouse,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
    resetState
  }
})
