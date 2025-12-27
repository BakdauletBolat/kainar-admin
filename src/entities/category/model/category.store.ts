import { defineStore } from 'pinia';
import type { TreeSelectOption } from 'naive-ui';
import { getCategories, getCategoriesTree, getCategoryById } from '../api/category.api';
import type { Category } from './types';

function recursiveCategory(children: any, options: TreeSelectOption[]) {
  for (let i = 0; i < children.length; i++) {
    const category = children[i];
    const count = category.products_count != null ? ` (${category.products_count})` : '';
    let option: TreeSelectOption = {
      label: `${category.name}${count}`,
      key: category.id,
    };
    if (category.children.length > 0) {
      const subChildren: TreeSelectOption[] = [];
      recursiveCategory(category.children, subChildren);
      option['children'] = subChildren;
    }
    options.push(option);
  }
}

export const useCategoryStore = defineStore('category', {
  state: () => {
    return {
      categories: [] as Category[],
      categoriesTree: [] as Category[],
      category: null as Category | null,
    };
  },
  getters: {
    categoriesOptions: (state) => {
      return state.categories.map<any>((item: any) => {
        const count = item.products_count != null ? ` (${item.products_count})` : '';
        return { label: `${item.name}${count}`, value: item.id };
      });
    },
    categoriesTreeOptions: (state) => {
      const options: TreeSelectOption[] = [];
      recursiveCategory(state.categoriesTree, options);
      return options;
    },
  },
  actions: {
    loadCategoryById(id: number) {
      getCategoryById(id).then((res) => {
        this.category = res.data;
      });
    },
    loadCategories() {
      getCategories()
        .then((res) => {
          this.categories = res.data.results;
        })
        .catch((e) => console.log(e));
    },
    loadCategoriesTree() {
      getCategoriesTree()
        .then((res) => {
          this.categoriesTree = res.data;
        })
        .catch((e) => console.log(e));
    },
  },
});
