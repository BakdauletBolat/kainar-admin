<template>
    <n-form :model="form" ref="formRef" label-width="120px">
        <div class="grid grid-cols-2 gap-4">
            <div>
                <n-form-item label="Название">
                    <n-input v-model:value="form.name" placeholder="Введите название продукта" />
                </n-form-item>
              <n-form-item label="Категория">
                <n-select v-model:value="form.category" :options="categoryStore.categoriesOptions"
                          placeholder="Введите категорию" />
              </n-form-item>
                <n-form-item label="Цена">
                    <n-input-number v-model:value="form.price" placeholder="Введите цену" />
                </n-form-item>

                <n-form-item label="Код">
                    <n-dynamic-input v-model:value="form.code" placeholder="Добавьте код" />
                </n-form-item>

                <n-form-item label="Объем двигателя">
                    <n-input-number v-model:value="form.eav_attributes.engineDisplacement"
                        placeholder="Введите объем двигателя" />
                </n-form-item>
                <n-form-item label="Пробег">
                    <n-input-number v-model:value="form.mileage" placeholder="Введите пробег" />
                </n-form-item>
              <n-form-item label="Цвет">
                <n-select :options="colorStore.colorOptions" v-model:value="form.color" placeholder="Введите цвет" />
              </n-form-item>
              <n-form-item label="VIN код">
                <n-input v-model:value="form.eav_attributes.vinCode" placeholder="Введите VIN код" />
              </n-form-item>
              <n-form-item label="Eмкость">
                <n-input-number v-model:value="form.eav_attributes.capacity" placeholder="Eмкость" />
              </n-form-item>
            </div>
            <!-- Правая колонка -->
            <div>
                <n-form-item label="Тип кузова">
                    <n-select v-model:value="form.eav_attributes.bodyType" :options="bodyTypeOptions"
                        placeholder="Выберите тип кузова" />
                </n-form-item>

                <n-form-item label="Конфигурация оси">
                    <n-select v-model:value="form.eav_attributes.axleConfiguration" :options="axleConfigurationOptions"
                        placeholder="Выберите конфигурацию оси" />
                </n-form-item>

                <n-form-item label="Привод">
                    <n-select v-model:value="form.eav_attributes.driveType" :options="driveTypeOptions"
                        placeholder="Выберите тип привода" />
                </n-form-item>

                <n-form-item label="Топливо">
                    <n-select v-model:value="form.eav_attributes.fuelType" :options="fuelTypeOptions"
                        placeholder="Выберите тип топлива" />
                </n-form-item>

                <n-form-item label="Коробка передач">
                    <n-select v-model:value="form.eav_attributes.gearType" :options="gearTypeOptions"
                        placeholder="Выберите коробку передач" />
                </n-form-item>
                <n-form-item label="Рулевое управление">
                    <n-select v-model:value="form.eav_attributes.steeringType" :options="steeringTypeOptions"
                        placeholder="Выберите тип рулевого управления" />
                </n-form-item>
              <n-form-item label="Количество циклов">
                <n-input-number v-model:value="form.eav_attributes.numberOfCycle" placeholder="Количество циклов" />
              </n-form-item>
              <n-form-item label="Количество клапанов">
                <n-input-number v-model:value="form.eav_attributes.numberOfValves" placeholder="Количество клапанов" />
              </n-form-item>
              <n-form-item label="Мощность">
                <n-input-number v-model:value="form.eav_attributes.power" placeholder="Мощность" />
              </n-form-item>
            </div>
        </div>

        <!-- Третья строка с textarea и кнопками -->
        <div class="grid grid-cols-1 gap-4 mt-4">
            <n-form-item label="Дефект">
                <n-input v-model:value="form.defect" type="textarea" placeholder="Опишите дефект" />
            </n-form-item>

            <n-form-item label="Комментарий">
                <n-input v-model:value="form.comment" type="textarea" placeholder="Введите комментарий" />
            </n-form-item>

            <div class="flex justify-end">
                <n-button type="primary" @click="handleSubmit">Сохранить</n-button>
            </div>
        </div>
    </n-form>
</template>
<script lang="ts" setup>
import axiosIns from "@/apis";
import { useCategoryStore } from "@/stores/category-storage";
import { useMessage, NForm, NFormItem, NButton, NSelect, NInput, NInputNumber, NDynamicInput } from "naive-ui";
import { onMounted, ref } from 'vue'
import {IModification, useModificationsStore} from "@/stores/modifications-store.ts";
import {useRoute, useRouter} from "vue-router";
import {useColorStore} from "@/stores/color-store.ts";
import {setCurrent} from "@/views/parts/create-steps/index.ts";

const categoryStore = useCategoryStore();
const modificationStore = useModificationsStore();
const colorStore = useColorStore();
const route = useRoute();
const router  = useRouter();
const form = ref({
    name: '',
    price: 1,
    code: [''],
    detail: {
        height: 0,
        width: 0,
        length: 0,
        weight: 0
    },
    eav_attributes: {
        axleConfiguration: "Передняя",
        bodyType: 'Внедорожник',
        driveType: 'Передние ведущие',
        engineDisplacement: 0,
        fuelType: 'Бензин / электричество',
        gearType: 'Полуавтомат',
        numberOfCycle: 0,
        numberOfValves: 0,
        power: 0,
        capacity: 0,
        steeringType: 'LHD',
        vinCode: null
    },
    mileage: 0,
    category: null,
    color: null,
    defect: '',
    comment: ''
})

const bodyTypeOptions = [
    { label: 'Внедорожник', value: 'Внедорожник' },
    { label: 'Купе', value: 'Купе' },
    { label: 'Универсал', value: 'Универсал' },
    { label: 'Кабриолет', value: 'Кабриолет' },
    { label: 'Минивен', value: 'Минивен' },
    { label: 'Пикап', value: 'Пикап' },
    { label: 'Микроавтобус / пассажирский', value: 'Микроавтобус / пассажирский' },
    { label: 'Хэтчбек', value: 'Хэтчбек' },
    { label: 'коммерческий', value: 'коммерческий' },
    { label: 'Тарга', value: 'Тарга' },
    { label: 'Седан', value: 'Седан' }
]

const axleConfigurationOptions = [
    { label: 'Передняя', value: 'Передняя' },
    { label: 'Задняя', value: 'Задняя' }
]

const driveTypeOptions = [
    { label: 'Передние ведущие', value: 'Передние ведущие' },
    { label: 'Все ведущие', value: 'Все ведущие' },
    { label: 'Задние ведущие', value: 'Задние ведущие' }
]

const fuelTypeOptions = [
    { label: 'Бензин / электричество', value: 'Бензин / электричество' },
    { label: 'LPG', value: 'LPG' },
    { label: 'Электричество', value: 'Электричество' },
    { label: 'Дизель / электричество', value: 'Дизель / электричество' },
    { label: 'Дизель', value: 'Дизель' },
    { label: 'Бензин', value: 'Бензин' }
]

const gearTypeOptions = [
    { label: 'Полуавтомат', value: 'Полуавтомат' },
    { label: 'МКПП', value: 'МКПП' },
    { label: 'АКПП', value: 'АКПП' }
]

const steeringTypeOptions = [
    { label: 'LHD', value: 'LHD' },
    { label: 'RHD', value: 'RHD' }
]

const message = useMessage()

const handleSubmit = () => {
    axiosIns.post(`/api/v2/product/create/`, form.value).then(res => {
      router.push({ query: { ...route.query, productId: res.data.id } })
      message.success("Успешно создан продукт")
      setCurrent(4);
    }).catch(e => {
      message.error(e)
    })
}


function updateIfNotNull(item: Object, excludeKeys: string[], setRef: any) {
    Object.keys(item).map(key=>{
      if (!excludeKeys.includes(key)) {
        //@ts-ignore
        if (item[key] != undefined || item[key] != null) {
          //@ts-ignore
          setRef.value.eav_attributes[key] = item[key]
        }
      }
    })
}

function updateForm(item: IModification) {
  updateIfNotNull(item, ['modelCar', 'id', 'name', 'engines'], form);
}

onMounted(() => {
    if (route.query.modificationId != null) {
        modificationStore.loadModification(parseInt(route.query.modificationId!.toString())).then((res)=>{
          updateForm(res)
        })
    }
    colorStore.loadColors();
    categoryStore.loadCategories();
})

</script>