/**
 * Category Store
 * State management для категорий
 *
 * МИГРИРУЕТ: src/stores/category-storage.ts
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { categoryApi } from '../api/category-api'
import { buildCategoryTree, categoriesToOptions } from '../lib/category-utils'
import type { Category, CategoryTree, CategoryTreeOption, CategoryOption } from './category-types'

export const useCategoryStore = defineStore('category', () => {
  // ================ STATE ================

  /**
   * Список всех категорий (плоский список)
   */
  const categories = ref<Category[]>([])

  /**
   * Дерево категорий (иерархия)
   */
  const categoriesTree = ref<CategoryTree[]>([])

  /**
   * Текущая выбранная категория
   */
  const category = ref<Category | null>(null)

  /**
   * Флаг загрузки
   */
  const isLoading = ref(false)

  // ================ GETTERS ================

  /**
   * Категории в виде опций для Select
   */
  const categoryOptions = computed<CategoryOption[]>(() => {
    return categoriesToOptions(categories.value)
  })

  /**
   * Дерево категорий в виде опций для TreeSelect (Naive UI)
   */
  const categoryTreeOptions = computed<CategoryTreeOption[]>(() => {
    return buildCategoryTree(categoriesTree.value)
  })

  /**
   * Проверка наличия категорий
   */
  const hasCategories = computed(() => {
    return categories.value.length > 0
  })

  // ================ ACTIONS ================

  /**
   * Загрузить список категорий
   */
  async function loadCategories(pageSize = 2000) {
    isLoading.value = true

    try {
      const response = await categoryApi.getList({ page_size: pageSize })
      categories.value = response.results
      return response
    } catch (error) {
      console.error('Failed to load categories:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Загрузить дерево категорий
   */
  async function loadCategoriesTree() {
    isLoading.value = true

    try {
      const tree = await categoryApi.getTree()
      categoriesTree.value = tree
      return tree
    } catch (error) {
      console.error('Failed to load categories tree:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Загрузить одну категорию по ID
   */
  async function loadCategoryById(id: number) {
    isLoading.value = true

    try {
      const cat = await categoryApi.getById(id)
      category.value = cat
      return cat
    } catch (error) {
      console.error('Failed to load category:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Создать категорию
   */
  async function createCategory(data: Partial<Category>) {
    try {
      const newCategory = await categoryApi.create(data)
      // Перезагрузить список после создания
      await loadCategories()
      return newCategory
    } catch (error) {
      console.error('Failed to create category:', error)
      throw error
    }
  }

  /**
   * Обновить категорию
   */
  async function updateCategory(id: number, data: Partial<Category>) {
    try {
      const updatedCategory = await categoryApi.update(id, data)
      // Обновить в списке
      const index = categories.value.findIndex(c => c.id === id)
      if (index !== -1) {
        categories.value[index] = updatedCategory
      }
      // Обновить текущую если это она
      if (category.value && category.value.id === id) {
        category.value = updatedCategory
      }
      return updatedCategory
    } catch (error) {
      console.error('Failed to update category:', error)
      throw error
    }
  }

  /**
   * Удалить категорию
   */
  async function deleteCategory(id: number) {
    try {
      await categoryApi.delete(id)
      // Удалить из списка
      categories.value = categories.value.filter(c => c.id !== id)
      // Очистить текущую если это она
      if (category.value && category.value.id === id) {
        category.value = null
      }
    } catch (error) {
      console.error('Failed to delete category:', error)
      throw error
    }
  }

  /**
   * Сбросить state
   */
  function resetState() {
    categories.value = []
    categoriesTree.value = []
    category.value = null
    isLoading.value = false
  }

  // ================ RETURN ================

  return {
    // State
    categories,
    categoriesTree,
    category,
    isLoading,

    // Getters
    categoryOptions,
    categoryTreeOptions,
    hasCategories,

    // Actions
    loadCategories,
    loadCategoriesTree,
    loadCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    resetState
  }
})
