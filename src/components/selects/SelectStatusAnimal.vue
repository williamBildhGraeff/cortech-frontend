<script>
    export default {
        name: 'SelectCategory',
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
                { title: 'Vendido', value: 'vendido' },
                { title: 'Morto', value: 'morto' },
                { title: 'Transferido', value: 'transferido' }
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
        prepend-inner-icon="mdi-list-status"
    />
</template>