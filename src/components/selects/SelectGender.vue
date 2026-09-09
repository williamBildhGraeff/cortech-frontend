<script>
    export default {
        name: 'SelectGender',
        props: {
            modelValue: {
                type: String,
                default: 'M'
            }
        },
        emits: ['update:modelValue'],
        data:()=> ({
            items: [
                { title: 'Macho', value: 'M' },
                { title: 'Fêmea', value: 'F' }
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
        label="Sexo"
        prepend-inner-icon="mdi-gender-male-female"
    />
</template>