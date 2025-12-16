/**
 * Refund Order Action
 * Действие возврата заказа
 */

import { ref, h } from 'vue'
import { useOrderStore } from '@entities/order'
import { useDialog, useMessage, NInput } from 'naive-ui'

export function useRefundOrder() {
  const orderStore = useOrderStore()
  const dialog = useDialog()
  const message = useMessage()

  const refundComment = ref('')

  function refundOrder(orderId: number | string) {
    refundComment.value = ''

    return new Promise<boolean>((resolve) => {
      dialog.create({
        title: 'Возврат заказа',
        content: () => {
          return h('div', [
            h('p', 'Укажите причину возврата:'),
            h(NInput, {
              value: refundComment.value,
              onUpdateValue: (val: string) => { refundComment.value = val },
              type: 'textarea',
              rows: 3,
              placeholder: 'Введите причину возврата'
            })
          ])
        },
        positiveText: 'Возврат',
        negativeText: 'Отмена',
        onPositiveClick: async () => {
          if (!refundComment.value.trim()) {
            message.warning('Укажите причину возврата')
            return false
          }

          try {
            await orderStore.setOrderId(orderId)
            await orderStore.refundOrder(refundComment.value)
            message.success('Возврат выполнен')
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
    refundOrder
  }
}
