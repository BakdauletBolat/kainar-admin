<template>
    <div>
        <p>{{ formatCurrency(value) }}</p>
    </div>
</template>

<script lang="ts">
export default {
    name: 'TengeAmount',
    props: {
        value: {
            type: Number || undefined,
            required: false,
        },
    },
    methods: {
        formatCurrency(num?: number): string {
            if (num == undefined) {
                return '-'
            }
            return new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'KZT',
                minimumFractionDigits: 2,
            }).format(num);
        },
    },
};
</script>

<style scoped>
p {
    font-size: 18px;
}
</style>