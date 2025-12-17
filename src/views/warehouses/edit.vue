<template>
    <main>
        <TopHeader :backRoute="{
            name: 'warehouses-list'
        }" title="Изменить склад"></TopHeader>
        <div v-if="item">
            <form @submit="onSubmit" class="mt-3 max-w-2xl  bg-white flex flex-col gap-3 p-5 rounded-sm border">
                <input :class="{
                    'border-red-500': errors.name
                }" v-model="name" v-bind="nameAttrs" type="text" />
                <div class="text-red-600">{{ errors.name }}</div>
                <button type="submit" class="bg-orange-400 p-3 text-white">Изменить</button>
            </form>
        </div>
    </main>
</template>
<script setup lang="ts">
import TopHeader from '@/shared/ui/TopHeader.vue';
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axiosIns from '@/shared/api/axios';
import { useForm } from 'vee-validate';
import * as yup from 'yup';


const item = ref(null);
const route = useRoute();

const getItem = (id: number) => {
    axiosIns.get(`/api/stock/warehouses/${id}/`).then(res => {
        item.value = res.data;
        resetForm({
       
        values: {
             //@ts-ignore
            name: item.value.name
        }
     })
    });
}

onMounted(() => {
    getItem(parseInt(route.params.id.toString()));
});

const { errors, handleSubmit, defineField, resetForm } = useForm({
    initialValues: {
         //@ts-ignore
        name: item.value?.name
    },
    validationSchema: yup.object({
        name: yup.string().min(6).required(),
    }),
});


const onSubmit = handleSubmit(values => {
    update(values);
});

const [name, nameAttrs] = defineField('name');

const isLoading = ref(false);
const router = useRouter();

const update = (values: any) => {
    isLoading.value = true;
    axiosIns.patch(`/api/stock/warehouses/${route.params.id.toString()}/`, values).then((response) => {
        console.log(response);
        router.push({
            name: 'warehouses-list'
        })
    }).finally(() => {
        isLoading.value = false;
    });
}
</script>
