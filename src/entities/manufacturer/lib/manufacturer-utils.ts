/**
 * Manufacturer Utils
 * Утилиты для работы с производителями
 */

import type { Manufacturer, ManufacturersByLetter, ManufacturerOption } from '../model/manufacturer-types'

/**
 * Группировка производителей по первой букве названия
 * МИГРИРУЕТ: manufacturersByLetterGrouping getter из src/stores/manufacturer-store.ts
 */
export function groupManufacturersByLetter(manufacturers: Manufacturer[]): ManufacturersByLetter {
  return manufacturers.reduce((accumulator, currentItem) => {
    // Получить первую букву и привести к верхнему регистру
    const firstLetter = currentItem.name[0].toUpperCase()

    // Инициализировать массив для этой буквы если не существует
    if (!accumulator[firstLetter]) {
      accumulator[firstLetter] = []
    }

    // Добавить производителя в соответствующий массив
    accumulator[firstLetter].push(currentItem)

    return accumulator
  }, {} as ManufacturersByLetter)
}

/**
 * Преобразовать список производителей в опции для Select
 */
export function manufacturersToOptions(manufacturers: Manufacturer[]): ManufacturerOption[] {
  return manufacturers.map(manufacturer => ({
    label: manufacturer.name,
    value: manufacturer.id
  }))
}

/**
 * Найти производителя по ID
 */
export function findManufacturerById(
  manufacturers: Manufacturer[],
  id: number
): Manufacturer | undefined {
  return manufacturers.find(m => m.id === id)
}
