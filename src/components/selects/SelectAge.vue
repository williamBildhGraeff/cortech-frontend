<script>
    export default {
        name: 'SelectAge',
        props: {
            modelValue: {
                type: String,
                default: 'menor_12_meses'
            }
        },
        emits: ['update:modelValue'],
        data:()=> ({
            items: [
                { title: 'Maior que 12 meses', value: 'menor_12_meses' },
                { title: 'Menor que 12 meses', value: 'maior_12_meses' },
            ]
        }),
        computed: {
            status: {
                get() {
                    return this.modelValue
                },
                set(value) {
                    this.$emit('update:modelValue', value)
                }
            }
        }
    }
</script>
<template>
    <v-select
        v-model="status"
        :items="items"
        label="Idade"
        prepend-inner-icon="mdi-calendar-clock"
    />
</template>