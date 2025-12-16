/**
 * Part Filter Store
 * Store для управления фильтрами запчастей
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PartFilters } from '@entities/part'

export const usePartFilterStore = defineStore('part-filter', () => {
  const filters = ref<PartFilters>({})

  function setFilter(key: keyof PartFilters, value: any) {
    filters.value = { ...filters.value, [key]: value }
  }

  function clearFilters() {
    filters.value = {}
  }

  function removeFilter(key: keyof PartFilters) {
    const newFilters = { ...filters.value }
    delete newFilters[key]
    filters.value = newFilters
  }

  return {
    filters,
    setFilter,
    clearFilters,
    removeFilter
  }
})
