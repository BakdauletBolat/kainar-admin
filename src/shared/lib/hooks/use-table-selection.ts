/**
 * Table Selection Composable
 * Хук для управления выбором строк в таблице
 */

import { ref, computed, type Ref } from 'vue'

export function useTableSelection<T extends { id: number | string }>(items: Ref<T[]>) {
  const selectedIds = ref<Set<number | string>>(new Set())

  const selectedItems = computed(() =>
    items.value.filter(item => selectedIds.value.has(item.id))
  )

  const isAllSelected = computed(() =>
    items.value.length > 0 && selectedIds.value.size === items.value.length
  )

  const isIndeterminate = computed(() =>
    selectedIds.value.size > 0 && selectedIds.value.size < items.value.length
  )

  function toggleItem(id: number | string) {
    if (selectedIds.value.has(id)) {
      selectedIds.value.delete(id)
    } else {
      selectedIds.value.add(id)
    }
    selectedIds.value = new Set(selectedIds.value)
  }

  function toggleAll() {
    if (isAllSelected.value) {
      selectedIds.value.clear()
    } else {
      items.value.forEach(item => selectedIds.value.add(item.id))
    }
    selectedIds.value = new Set(selectedIds.value)
  }

  function clearSelection() {
    selectedIds.value.clear()
    selectedIds.value = new Set()
  }

  function isSelected(id: number | string): boolean {
    return selectedIds.value.has(id)
  }

  return {
    selectedIds,
    selectedItems,
    isAllSelected,
    isIndeterminate,
    toggleItem,
    toggleAll,
    clearSelection,
    isSelected,
  }
}
