<script>
import animalApi from '../../../api/animals'
export default {
    props: {
        modelValue: {
            type: Boolean,
            default: false
        },

        animal: {
            type: Object,
            default: () => {}
        }
    },

    emits: ['update:modelValue', 'list'],

    data: () => ({
        animalData: {}
    }),

    computed: {
        dialog:{
            get(){
                return this.modelValue
            },

            set(value){
                this.$emit('update:modelValue', value)
            }
        },

        title(){
            return this.animal.id ? 'Editar animal' : 'Adicionar animal'
        }
    },

    methods: {
        async salvar(){
            try {
                const { valid } = await this.$refs.validateForm.validate()
                if(!valid) return 
                if(this.animalData.id) {
                    await animalApi.updateAnimal(this.animalData.id, this.animalData)
                } else {
                    const lote_id = localStorage.getItem('lot')
                    await animalApi.createAnimal(lote_id, this.animalData)
                }
                this.$toast.success('Sucesso ao salvar as informações!')
                this.$emit('list')
                this.dialog = false
            } catch (error) {
                console.error(error)
                this.$toast.error(this.$errorApi(error))
            }
        },

        clear(){
            this.animalData = {}
        }
    }
}
</script>
<template>
    <v-dialog 
        v-model="dialog" 
        persistent 
        max-width="900" 
        @after-enter="animalData = {...animal}">
        <v-card>
            <v-toolbar density="compact" color="primary">
                <v-toolbar-title>
                    <v-icon
                    icon="mdi-cow"
                    class="me-2"/>
                    {{ title }}
                </v-toolbar-title>
                <v-toolbar-items>
                    <v-btn
                        icon="mdi-close"
                        @click="dialog = false"
                    />
                </v-toolbar-items>
            </v-toolbar>
            <v-card-text>
                <v-form ref="validateForm">
                     <v-row>
                        <v-col cols="12" md="6">
                            <v-text-field
                                prepend-inner-icon="mdi-tag-outline"
                                v-model="animalData.brinco"    
                                label="Brinco"/>
                        </v-col>
                         <v-col cols="12" md="6">
                            <select-gender
                                v-model="animalData.sexo"/>
                        </v-col>
                         <v-col cols="12" md="6">
                            <select-category
                                v-model="animalData.categoria"/>
                        </v-col>
                         <v-col cols="12" md="6">
                            <v-text-field
                                v-model="animalData.raca"    
                                prepend-inner-icon="mdi-cow"
                                label="Raça"/>
                        </v-col>
                         <v-col cols="12" md="6">
                            <select-origin
                                v-model="animalData.origem"/>
                        </v-col>
                         <v-col cols="12" md="6">
                            <select-status-animal v-model="animalData.status"/>
                        </v-col>
                         <v-col cols="12">
                            <select-age v-model="animalData.idade"/>
                        </v-col>
                     </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-btn 
                    text="Salvar"
                    color="success"
                    variant="flat"
                    prepend-icon="mdi-content-save"
                    @click="salvar"
                />
            </v-card-actions>
        </v-card>

    </v-dialog>
</template>
