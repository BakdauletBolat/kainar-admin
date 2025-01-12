<template>
    <main>
        <n-page-header @back="handleBack" class="mb-4">
            <template #title>
                Информация о складе
            </template>
        </n-page-header>
        <section>
            <n-form :model="warehouseStore.warehouse" ref="formRef">
                <n-form-item label="ID" path="id">
                    <n-input v-model:value="warehouseStore.warehouse.id" disabled />
                </n-form-item>

                <n-form-item label="Название" path="name">
                    <n-input v-model:value="warehouseStore.warehouse.name" />
                </n-form-item>

                <n-form-item v-if="warehouseStore.warehouse.city" label="Город" path="city.id">
                    <n-select v-model:value="warehouseStore.warehouse.city.id" placeholder="Выбрать город"
                        :options="cityOptions" />
                </n-form-item>
                <n-form-item v-else label="Город" path="city.id">
                    <n-select v-model:value="city_id" placeholder="Выбрать город" :options="cityOptions" />
                </n-form-item>
              <n-form-item label="Категории">
                <n-select v-model:value="categories" placeholder="Выбрать категории"
                          multiple
                          filterable
                          :options="categoryStore.categoriesOptions" />
              </n-form-item>
                <n-form-item label="Минимальный уровень запасов">
                    <n-input-number v-model:value="warehouseStore.warehouse.min_stock_level" />
                </n-form-item>
                <n-button-group>
                    <n-button :loading="warehouseStore.isLoading" type="primary" @click="submitForm">Обновить</n-button>
                    <n-button :loading="warehouseStore.isLoading" type="error"
                        @click="removeWarehouse">Удалить</n-button>
                </n-button-group>

            </n-form>
        </section>
    </main>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import {
    NForm,
    NFormItem,
    NInput,
    NInputNumber,
    NButton,
    NPageHeader,
    NSelect,
    useMessage,
    NButtonGroup
} from 'naive-ui';
import { useWarehouseStore } from '@/stores/warehouses-store';
import axiosIns from '@/apis';
import {useCategoryStore} from "@/stores/category-storage.ts";

const warehouseStore = useWarehouseStore();
const categoryStore = useCategoryStore();

// Ссылка на форму для валидации
const formRef = ref();
const router = useRouter();
const route = useRoute();
const message = useMessage();
const city_id = ref();
const categories = ref<any[]>([]);

const cityOptions = [
    {
        label: "Шымкент",
        value: 3
    }, {
        label: "Астана",
        value: 4
    }
]


onMounted(() => {
    warehouseStore.loadWarehouse(parseInt(route.params.id.toString())).then((warehouse)=>{
      if (warehouse) {
        city_id.value = warehouse.city?.id;
        categories.value = warehouse.categories.map(category=>category.id);
      }
    })
    categoryStore.loadCategories();
})


function patchWarehouse(id: string, body: Object) {
    axiosIns.patch(`/api/admin/stock/warehouses/${id}/`, body).then(_ => {
        router.push({
            name: 'warehouses-list'
        })
        message.success("Успешно обновился")
    }).catch((e) => {
        message.error("Ошибка при обновлении " + e.toString())
    })
}

// Метод для отправки формы
const submitForm = () => {
    (formRef.value as InstanceType<typeof NForm>).validate((errors: any) => {
        if (!errors) {
            // Обработка отправки формы
            patchWarehouse(warehouseStore.warehouse.id, {
                name: warehouseStore.warehouse.name,
                min_stock_level: warehouseStore.warehouse.min_stock_level,
                city_id: city_id.value,
                category_ids: categories.value
            })
        }
    });
};

function removeWarehouse() {
    warehouseStore.removeWarehouse(route.params.id.toString()).then(_ => {
        message.success("Успешно удален")
        router.push({
            name: 'warehouses-list'
        })
    }).catch(e => {
        message.error("Ошибка при удалении " + e.toString())
    })
}


function handleBack() {
    router.back()
}
</script>