/**
 * Array Utilities
 *
 * МИГРИРУЕТ: src/utils/getFirstElementFromArray.ts
 */

export function getFirstElement<T>(array: T[] | undefined | null): T | undefined {
  if (!array || !Array.isArray(array) || array.length === 0) {
    return undefined
  }
  return array[0]
}

export function getLastElement<T>(array: T[] | undefined | null): T | undefined {
  if (!array || !Array.isArray(array) || array.length === 0) {
    return undefined
  }
  return array[array.length - 1]
}

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

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)]
}
