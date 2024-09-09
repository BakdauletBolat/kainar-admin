import {defineStore} from 'pinia'
import axiosInstance from "@/apis";
import type {ISelectOption} from "@/apis/interfaces";
import type {TreeSelectOption} from "naive-ui";


export interface Category {
    id: number;
    name: string;
}

function recursiveCategory(children: any, options: TreeSelectOption[]) {
    for (let i = 0; i<children.length; i++) {
        const category = children[i];
        let option: TreeSelectOption = {
            label: category.name,
            key: category.id
        }
        if (category.children.length>0) {
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
            category: null as Category | null
        }
    },
    getters: {
        categoriesOptions: (state) => {
            return state.categories.map<ISelectOption>(item=>{
                return {label: item.name,value:item.id}
            })
        },
        categoriesTreeOptions: (state) => {
            const options: TreeSelectOption[] = []
            recursiveCategory(state.categoriesTree, options);
            return options;
        }
    },
    actions: {
        loadCategoryById(id: number) {
          axiosInstance.get(`/api/category/${id}`).then(
              res=>{
                  this.category = res.data
              }
          )
        },
        loadCategories() {
            axiosInstance.get(`/api/category?page_size=2000`).then(
                (res) => {
                    this.categories = res.data.results
                }
            ).catch(e => console.log(e));
        },
        loadCategoriesTree() {
            axiosInstance.get(`/api/category/tree`).then(
                (res) => {
                    this.categoriesTree = res.data;
                }
            ).catch(e => console.log(e));
        },
    },
})