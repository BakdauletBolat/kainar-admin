/**
 * Close Feedback Action
 * Действие закрытия обратной связи
 */

import { useFeedbackStore } from '@entities/feedback'
import { useDialog, useMessage } from 'naive-ui'

export function useCloseFeedback() {
  const feedbackStore = useFeedbackStore()
  const dialog = useDialog()
  const message = useMessage()

  function closeFeedback(feedbackId: number | string) {
    return new Promise<boolean>((resolve) => {
      dialog.info({
        title: 'Закрытие обращения',
        content: 'Вы уверены, что хотите закрыть это обращение?',
        positiveText: 'Закрыть',
        negativeText: 'Отмена',
        onPositiveClick: async () => {
          try {
            await feedbackStore.closeFeedback(feedbackId)
            message.success('Обращение закрыто')
            resolve(true)
          } catch {
            resolve(false)
          }
        },
        onNegativeClick: () => {
          resolve(false)
        }
      })
    })
  }

  return {
    closeFeedback
  }
}
