<script>
import animals from '../../api/animals';

    export default {
        name: 'SelectAnimal',
        props: {
            modelValue: {
                type: Number,
                default: null
            }
        },
        emits: ['update:modelValue'],

        data:()=> ({
            animais: []
        }),

        mounted(){
            this.getAnimals()
        },

        computed: {
            animal: {
                get() {
                    return this.modelValue
                },
                set(value) {
                    this.$emit('update:modelValue', value)
                }
            }
        },

        methods: {
            async getAnimals(){
                try {
                    const response = await animals.getAnimals()
                    this.animais = response
                } catch (error) {
                    console.error(error)
                    this.$toast.error(this.$errorApi(error))
                }
            },
        }
    }
</script>
<template>
    <v-select
        v-model="animal"
        :items="animais"
        item-value="id"
        item-title="brinco"
        label="Animal"
        prepend-inner-icon="mdi-cow"
    />
</template>