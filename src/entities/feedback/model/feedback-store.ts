/**
 * Feedback Store
 * State management для заявок
 *
 * МИГРИРУЕТ: src/stores/feedback-store.ts
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { feedbackApi } from '../api/feedback-api'
import type { Feedback, FeedbackFilters } from './feedback-types'

export const useFeedbackStore = defineStore('feedback', () => {
  // ================ STATE ================

  /**
   * Список заявок
   */
  const feedbacks = ref<Feedback[]>([])

  /**
   * Общее количество заявок
   */
  const totalCount = ref(0)

  /**
   * Флаг загрузки
   */
  const isLoading = ref(false)

  // ================ GETTERS ================

  /**
   * Проверка наличия заявок
   */
  const hasFeedbacks = computed(() => {
    return feedbacks.value.length > 0
  })

  /**
   * Активные заявки (не завершенные)
   */
  const activeFeedbacks = computed(() => {
    return feedbacks.value.filter(fb => !fb.completedAt)
  })

  /**
   * Завершенные заявки
   */
  const completedFeedbacks = computed(() => {
    return feedbacks.value.filter(fb => fb.completedAt !== null)
  })

  // ================ ACTIONS ================

  /**
   * Загрузить список заявок
   */
  async function loadFeedbacks(filters: FeedbackFilters = {}) {
    isLoading.value = true

    try {
      const response = await feedbackApi.getList(filters)
      feedbacks.value = response.results
      totalCount.value = response.count
      return response.results
    } catch (error) {
      console.error('Failed to load feedbacks:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Закрыть заявку
   */
  async function closeFeedback(id: number | string) {
    isLoading.value = true

    try {
      const updatedFeedback = await feedbackApi.close(Number(id))

      // Обновить в списке
      const index = feedbacks.value.findIndex(fb => fb.id === id)
      if (index !== -1) {
        feedbacks.value[index] = updatedFeedback
      }

      return updatedFeedback
    } catch (error) {
      console.error('Failed to close feedback:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Удалить заявку
   */
  async function deleteFeedback(id: number) {
    try {
      await feedbackApi.delete(id)
      feedbacks.value = feedbacks.value.filter(fb => fb.id !== id)
      totalCount.value = Math.max(0, totalCount.value - 1)
    } catch (error) {
      console.error('Failed to delete feedback:', error)
      throw error
    }
  }

  /**
   * Сбросить state
   */
  function resetState() {
    feedbacks.value = []
    totalCount.value = 0
    isLoading.value = false
  }

  // ================ RETURN ================

  return {
    // State
    feedbacks,
    totalCount,
    isLoading,

    // Getters
    hasFeedbacks,
    activeFeedbacks,
    completedFeedbacks,

    // Actions
    loadFeedbacks,
    closeFeedback,
    deleteFeedback,
    resetState
  }
})
