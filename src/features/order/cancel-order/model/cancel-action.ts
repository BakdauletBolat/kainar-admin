/**
 * Cancel Order Action
 * Действие отмены заказа
 */

import { useOrderStore } from '@entities/order'
import { useDialog, useMessage } from 'naive-ui'

export function useCancelOrder() {
  const orderStore = useOrderStore()
  const dialog = useDialog()
  const message = useMessage()

  function cancelOrder(orderId: number | string) {
    return new Promise<boolean>((resolve) => {
      dialog.warning({
        title: 'Отмена заказа',
        content: 'Вы уверены, что хотите отменить этот заказ?',
        positiveText: 'Отменить',
        negativeText: 'Назад',
        onPositiveClick: async () => {
          try {
            await orderStore.setOrderId(orderId)
            await orderStore.cancelOrder()
            message.success('Заказ отменен')
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
    cancelOrder
  }
}
