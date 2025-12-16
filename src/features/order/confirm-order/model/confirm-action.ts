/**
 * Confirm Order Action
 * Действие подтверждения заказа
 */

import { useOrderStore } from '@entities/order'
import { useDialog, useMessage } from 'naive-ui'

export function useConfirmOrder() {
  const orderStore = useOrderStore()
  const dialog = useDialog()
  const message = useMessage()

  function confirmOrder(orderId: number | string) {
    return new Promise<boolean>((resolve) => {
      dialog.info({
        title: 'Подтверждение заказа',
        content: 'Вы уверены, что хотите подтвердить этот заказ?',
        positiveText: 'Подтвердить',
        negativeText: 'Отмена',
        onPositiveClick: async () => {
          try {
            await orderStore.setOrderId(orderId)
            await orderStore.confirmOrder()
            message.success('Заказ подтвержден')
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
    confirmOrder
  }
}
