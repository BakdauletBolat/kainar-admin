<template>
    <div v-if="pictures.length > 0" class="w-full flex flex-col gap-3">
        <div class="w-full relative">
            <Flicking @changed="onChange" class="rounded-sm" ref="flicking" :options="{
                preventClickOnDrag: true,
                duration: 100
            }">
                <div :key="picture.id" v-for="picture in pictures" class="panel border-b cursor-pointer w-full h-[300px]">
                    <img alt="s" loading="lazy" class=" w-full pointer-events-none h-full object-cover" :src="picture.image" />
                </div>
            </Flicking>
            <div>
                <ChevronLeftIcon @click="prev" class="absolute z-10 top-1/2 cursor-pointer w-7 h-7"></ChevronLeftIcon>
                <ChevronRightIcon  @click="next" class="absolute z-10 top-1/2 right-0 w-7 h-7 cursor-pointer"></ChevronRightIcon>
            </div>
        </div>
        <div class="w-full">
            <Flicking ref="flicking2" :options="{
                preventClickOnDrag: true,
                panelsPerView: 3,
                duration: 100,
                bound: true,
                align: 'center',
            }">
                <div @click="currentValue = index" :key="product.id" v-for="(product, index) in pictures"
                    class="mx-1 rounded-sm border-b overflow-hidden cursor-pointer">
                    <div class="w-full h-[80px] relative">
                        <img loading="lazy" class="w-full absolute top-0 left-0 pointer-events-none h-full object-cover" :src="product.image" />
                        <div v-if="currentValue == index" class="w-full h-full bg-black opacity-10 absolute top-0"></div>
                    </div>
                </div>
            </Flicking>
        </div>
    </div>
    <div v-else>
        Нету фотографий
    </div>
</template>
<script setup lang="ts">
import Flicking from "@egjs/vue3-flicking";
import { ref, watchEffect } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";

type ChangedValue = {
    index: number;
}

type Picture = {
    id: number;
    image: string;
}

const currentValue = ref(0);

function onChange(changed: ChangedValue) {
    currentValue.value = changed.index;
}

const flicking = ref<Flicking | null>(null);
const flicking2 = ref<Flicking | null>(null);

watchEffect(() => {
    if (flicking.value != null && flicking2.value != null) {
        try {
            flicking.value!.moveTo(currentValue.value);
            flicking2.value!.moveTo(currentValue.value);
        }   
        catch (e) {

        }
       
    }
});

const props =defineProps<{
    pictures: Picture[]
}>();

function next() {
    
    if (currentValue.value >= props.pictures.length - 1) {
        return;
    }
    currentValue.value += 1;
}

function prev() {
    console.log(currentValue.value, props.pictures.length)
    if (currentValue.value <= 0) {
        return;
    }
    currentValue.value -= 1;
}



</script>