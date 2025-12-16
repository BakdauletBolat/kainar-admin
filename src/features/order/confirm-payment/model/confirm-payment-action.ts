/**
 * Confirm Payment Action
 * Действие подтверждения оплаты заказа
 */

import { useOrderStore } from '@entities/order'
import { useDialog, useMessage } from 'naive-ui'

export function useConfirmPayment() {
  const orderStore = useOrderStore()
  const dialog = useDialog()
  const message = useMessage()

  function confirmPayment(orderId: number | string) {
    return new Promise<boolean>((resolve) => {
      dialog.info({
        title: 'Подтверждение оплаты',
        content: 'Вы уверены, что хотите подтвердить оплату этого заказа?',
        positiveText: 'Подтвердить',
        negativeText: 'Отмена',
        onPositiveClick: async () => {
          try {
            await orderStore.setOrderId(orderId)
            await orderStore.confirmPayment()
            message.success('Оплата подтверждена')
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
    confirmPayment
  }
}
