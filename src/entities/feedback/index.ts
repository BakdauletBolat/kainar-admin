/**
 * Feedback Entity - Public API
 * Единая точка экспорта для модуля Feedback
 */

// Store
export { useFeedbackStore } from './model/feedback-store'

// API
export { feedbackApi } from './api/feedback-api'

// Types
export type {
  Feedback,
  FeedbackFilters
} from './model/feedback-types'
