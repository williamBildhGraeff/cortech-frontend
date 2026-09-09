<script>
    export default {
        name: 'SelectCategory',
        props: {
            modelValue: {
                type: String,
                default: 'novilho'
            }
        },
        emits: ['update:modelValue'],
        data:()=> ({
            items: [
                { title: 'Novilho(a)', value: 'novilho' },
                { title: 'Bezerro(a)', value: 'bezerro' },
                { title: 'Vaca', value: 'vaca' },
                { title: 'Touro', value: 'touro' }
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
        label="Categoria"
        prepend-inner-icon="mdi-tag"
    />
</template>