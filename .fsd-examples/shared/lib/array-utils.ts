/**
 * Array Utilities
 * Утилиты для работы с массивами
 *
 * МИГРИРУЕТ: src/utils/getFirstElementFromArray.ts
 *
 * Использование:
 * import { getFirstElement, getLastElement, chunk } from '@shared/lib/utils/array-utils'
 */

/**
 * Получение первого элемента массива
 *
 * ЗАМЕНЯЕТ: src/utils/getFirstElementFromArray.ts
 *
 * @example
 * getFirstElement([1, 2, 3]) // => 1
 * getFirstElement([]) // => undefined
 * getFirstElement(null) // => undefined
 */
export function getFirstElement<T>(array: T[] | undefined | null): T | undefined {
  if (!array || !Array.isArray(array) || array.length === 0) {
    return undefined
  }
  return array[0]
}

/**
 * Получение последнего элемента массива
 *
 * @example
 * getLastElement([1, 2, 3]) // => 3
 * getLastElement([]) // => undefined
 */
export function getLastElement<T>(array: T[] | undefined | null): T | undefined {
  if (!array || !Array.isArray(array) || array.length === 0) {
    return undefined
  }
  return array[array.length - 1]
}

/**
 * Разбивает массив на части (chunks)
 *
 * @example
 * chunk([1, 2, 3, 4, 5], 2) // => [[1, 2], [3, 4], [5]]
 */
export function chunk<T>(array: T[], size: number): T[][] {
  if (size <= 0) {
    throw new Error('Chunk size must be positive')
  }

  return array.reduce((chunks, item, index) => {
    const chunkIndex = Math.floor(index / size)
    if (!chunks[chunkIndex]) {
      chunks[chunkIndex] = []
    }
    chunks[chunkIndex].push(item)
    return chunks
  }, [] as T[][])
}

/**
 * Удаление дубликатов из массива
 *
 * @example
 * unique([1, 2, 2, 3, 3, 3]) // => [1, 2, 3]
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)]
}

/**
 * Удаление дубликатов по ключу
 *
 * @example
 * uniqueBy([{id: 1}, {id: 2}, {id: 1}], 'id') // => [{id: 1}, {id: 2}]
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set()
  return array.filter(item => {
    const value = item[key]
    if (seen.has(value)) {
      return false
    }
    seen.add(value)
    return true
  })
}

/**
 * Группировка массива по ключу
 *
 * @example
 * groupBy([{type: 'a', val: 1}, {type: 'b', val: 2}, {type: 'a', val: 3}], 'type')
 * // => { a: [{type: 'a', val: 1}, {type: 'a', val: 3}], b: [{type: 'b', val: 2}] }
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key])
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

/**
 * Случайный элемент из массива
 *
 * @example
 * randomElement([1, 2, 3, 4, 5]) // => 3 (случайный)
 */
export function randomElement<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Перемешивание массива (shuffle)
 *
 * @example
 * shuffle([1, 2, 3, 4, 5]) // => [3, 1, 5, 2, 4] (случайный порядок)
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
