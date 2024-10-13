<template>
    <transition name="slide" enter-active-class="transition-transform duration-500"
        leave-active-class="transition-transform duration-500" enter-from-class="-translate-x-full opacity-0"
        enter-to-class="translate-x-0 opacity-100" leave-from-class="translate-x-0 opacity-100"
        leave-to-class="-translate-x-full opacity-0">
        <div v-if="isVisible">
            <slot></slot>
        </div>
    </transition>
</template>

<script lang="ts" setup>
defineProps(['isVisible'])
</script>
<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s, opacity 0.5s;
}
</style>