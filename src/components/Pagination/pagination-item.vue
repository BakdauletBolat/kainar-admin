<script setup lang="ts">
defineProps(['item', 'isActive'])
</script>
<template>
	<div 
	:class="{
		'bg-primary text-white': isActive
	}"
	class=" px-4 py-2 rounded cursor-pointer">{{item}}</div>
</template>
<style>
</style>