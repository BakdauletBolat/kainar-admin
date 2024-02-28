<template>
    <main>
        <TopHeader :backRoute="{
            name: 'warehouses-list'
        }" title="Создать склад"></TopHeader>
        <form @submit="onSubmit"  class="mt-3 max-w-2xl  bg-white flex flex-col gap-3 p-5 rounded-sm border">
            <input :class="{
            'border-red-500': errors.name
        }" v-model="name" v-bind="nameAttrs" type="text" />
            <div class="text-red-600">{{ errors.name }}</div>
            <button type="submit" class="bg-orange-400 p-3 text-white">Сохранить</button>
        </form>
    </main>
</template>
<script setup lang="ts">
import TopHeader from '@/components/TopHeader.vue';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import axiosIns from '@/apis';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: yup.object({
    name: yup.string().min(6).required(),
  }),
});

const onSubmit = handleSubmit(values => {
  create(values);
});


const [name, nameAttrs] = defineField('name');


const isLoading = ref(false);
const router = useRouter();

const create = (values:any) => {
    isLoading.value = true;
    axiosIns.post("/api/stock/warehouses/",values).then((response) => {
        console.log(response);
        router.push({
            name: 'warehouses-list'
        })
    }).finally(() => {
        isLoading.value = false;
    });
}

const form = reactive({
    name: ''
})
</script>