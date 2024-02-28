<script setup lang="ts">
defineProps(['url'])
</script>
<template>
        <div>
                <img class="h-full w-full object-cover" :src="url" />
        </div>
        
</template>