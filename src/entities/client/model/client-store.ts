/**
 * Client Store
 * State management для клиентов
 *
 * МИГРИРУЕТ: src/stores/client-store.ts
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { clientApi } from '../api/client-api'
import type { Client, ClientFilters } from './client-types'

export const useClientStore = defineStore('client', () => {
  // ================ STATE ================

  /**
   * Список клиентов
   */
  const clients = ref<Client[]>([])

  /**
   * Текущий клиент
   */
  const client = ref<Client | null>(null)

  /**
   * Общее количество клиентов
   */
  const totalCount = ref(0)

  /**
   * Флаг загрузки
   */
  const isLoading = ref(false)

  // ================ GETTERS ================

  /**
   * Проверка наличия клиентов
   */
  const hasClients = computed(() => {
    return clients.value.length > 0
  })

  // ================ ACTIONS ================

  /**
   * Загрузить список клиентов
   */
  async function loadClients(filters: ClientFilters = {}) {
    isLoading.value = true

    try {
      const response = await clientApi.getList(filters)
      clients.value = response.results
      totalCount.value = response.count
      return response.results
    } catch (error) {
      console.error('Failed to load clients:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Загрузить одного клиента по ID
   */
  async function loadClient(id: number | string) {
    isLoading.value = true

    try {
      const cl = await clientApi.getById(id)
      client.value = cl
      return cl
    } catch (error) {
      console.error('Failed to load client:', error)
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Обновить клиента
   */
  async function updateClient(id: number | string, data: Partial<Client>) {
    try {
      const updatedClient = await clientApi.update(id, data)

      // Обновить в списке
      const index = clients.value.findIndex(c => c.id === id)
      if (index !== -1) {
        clients.value[index] = updatedClient
      }

      // Обновить текущего если это он
      if (client.value && client.value.id === id) {
        client.value = updatedClient
      }

      return updatedClient
    } catch (error) {
      console.error('Failed to update client:', error)
      throw error
    }
  }

  /**
   * Создать клиента
   */
  async function createClient(data: Partial<Client>) {
    try {
      const newClient = await clientApi.create(data)
      // Перезагрузить список после создания
      await loadClients()
      return newClient
    } catch (error) {
      console.error('Failed to create client:', error)
      throw error
    }
  }

  /**
   * Удалить клиента
   */
  async function deleteClient(id: number | string) {
    try {
      await clientApi.delete(id)
      clients.value = clients.value.filter(c => c.id !== id)
      totalCount.value = Math.max(0, totalCount.value - 1)

      if (client.value && client.value.id === id) {
        client.value = null
      }
    } catch (error) {
      console.error('Failed to delete client:', error)
      throw error
    }
  }

  /**
   * Сбросить state
   */
  function resetState() {
    clients.value = []
    client.value = null
    totalCount.value = 0
    isLoading.value = false
  }

  // ================ RETURN ================

  return {
    // State
    clients,
    client,
    totalCount,
    isLoading,

    // Getters
    hasClients,

    // Actions
    loadClients,
    loadClient,
    updateClient,
    createClient,
    deleteClient,
    resetState
  }
})
