/**
 * Delete Part Action
 * Действие удаления запчасти
 */

import { usePartStore } from '@entities/part'
import { useDialog, useMessage } from 'naive-ui'

export function useDeletePart() {
  const partStore = usePartStore()
  const dialog = useDialog()
  const message = useMessage()

  function deletePart(id: number | string, name: string) {
    return new Promise<boolean>((resolve) => {
      dialog.warning({
        title: 'Удаление запчасти',
        content: `Вы уверены, что хотите удалить запчасть "${name}"?`,
        positiveText: 'Удалить',
        negativeText: 'Отмена',
        onPositiveClick: async () => {
          try {
            await partStore.deletePart(id)
            message.success('Запчасть удалена')
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

  function bulkDeleteParts(ids: number[], count: number) {
    return new Promise<boolean>((resolve) => {
      dialog.warning({
        title: 'Удаление запчастей',
        content: `Вы уверены, что хотите удалить ${count} запчастей?`,
        positiveText: 'Удалить',
        negativeText: 'Отмена',
        onPositiveClick: async () => {
          try {
            await partStore.bulkDeleteParts(ids)
            message.success(`Удалено запчастей: ${count}`)
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
    deletePart,
    bulkDeleteParts
  }
}
