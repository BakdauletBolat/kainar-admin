/**
 * Category Utils
 * Утилиты для работы с категориями
 */

import type { Category, CategoryTree, CategoryTreeOption, CategoryOption } from '../model/category-types'

/**
 * Рекурсивное построение дерева для TreeSelect (Naive UI)
 * МИГРИРУЕТ: recursiveCategory из src/stores/category-storage.ts
 */
export function buildCategoryTree(categories: CategoryTree[]): CategoryTreeOption[] {
  const options: CategoryTreeOption[] = []

  function recursive(children: CategoryTree[], targetOptions: CategoryTreeOption[]) {
    for (const category of children) {
      const option: CategoryTreeOption = {
        label: category.name,
        key: category.id
      }

      if (category.children && category.children.length > 0) {
        const subChildren: CategoryTreeOption[] = []
        recursive(category.children, subChildren)
        option.children = subChildren
      }

      targetOptions.push(option)
    }
  }

  recursive(categories, options)
  return options
}

/**
 * Преобразовать список категорий в опции для Select
 */
export function categoriesToOptions(categories: Category[]): CategoryOption[] {
  return categories.map(category => ({
    label: category.name,
    value: category.id
  }))
}

/**
 * Найти категорию по ID в плоском списке
 */
export function findCategoryById(categories: Category[], id: number): Category | undefined {
  return categories.find(cat => cat.id === id)
}

/**
 * Найти категорию по ID в дереве (рекурсивно)
 */
export function findCategoryInTree(tree: CategoryTree[], id: number): CategoryTree | null {
  for (const category of tree) {
    if (category.id === id) {
      return category
    }

    if (category.children && category.children.length > 0) {
      const found = findCategoryInTree(category.children, id)
      if (found) return found
    }
  }

  return null
}
