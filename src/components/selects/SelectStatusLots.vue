<script>
    export default {
        name: 'SelectStatusLots',
        props: {
            modelValue: {
                type: String,
                default: 'ativo'
            }
        },
        emits: ['update:modelValue'],
        data:()=> ({
            items: [
                { title: 'Ativo', value: 'ativo' },
                { title: 'Vendido', value: 'vendido' }
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
        label="Status"
        prepend-inner-icon="mdi-information"
    />
</template>