/**
 * Feedback Entity Types
 * МИГРИРУЕТ: src/stores/feedback-store.ts (IFeedback interface)
 */

/**
 * Заявка/обратная связь
 */
export interface Feedback {
  id: number
  name: string
  phone: string
  isClosed: boolean
  createdAt: Date
  updatedAt: Date
  completedAt: Date | null
}

/**
 * Фильтры для заявок
 */
export interface FeedbackFilters {
  search?: string
  completed?: boolean
  limit?: number
  offset?: number
  page?: number
  pageSize?: number
}
