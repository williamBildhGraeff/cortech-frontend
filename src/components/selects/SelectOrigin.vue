<script>
    export default {
        name: 'SelectOrigin',
        props: {
            modelValue: {
                type: String,
                default: 'compra'
            }
        },
        emits: ['update:modelValue'],
        data:()=> ({
            items: [
                { title: 'Compra', value: 'compra' },
                { title: 'Nascimento', value: 'nascimento' },
                { title: 'Terceiros', value: 'terceiros' },
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
        label="Origem"
        prepend-inner-icon="mdi-origin"
    />
</template>