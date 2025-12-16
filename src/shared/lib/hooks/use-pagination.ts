/**
 * Pagination Composable
 * Хук для управления пагинацией
 */

import { ref, computed } from 'vue'

export function usePagination(initialPage = 1, initialPageSize = 20) {
  const currentPage = ref(initialPage)
  const pageSize = ref(initialPageSize)
  const totalItems = ref(0)

  const totalPages = computed(() =>
    Math.ceil(totalItems.value / pageSize.value) || 1
  )

  const offset = computed(() => (currentPage.value - 1) * pageSize.value)

  function setPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  function nextPage() {
    setPage(currentPage.value + 1)
  }

  function prevPage() {
    setPage(currentPage.value - 1)
  }

  function reset() {
    currentPage.value = initialPage
    totalItems.value = 0
  }

  return {
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    offset,
    setPage,
    nextPage,
    prevPage,
    reset,
  }
}
