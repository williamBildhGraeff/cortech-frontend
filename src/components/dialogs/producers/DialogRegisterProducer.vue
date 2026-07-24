<script>
import producers from '@/api/producers'

    export default {
        name: 'DialogRegisterProducer',
        props: {
            modelValue: {
                type: Boolean,
                required: true
            },

            producer: {
                type: Object,
                default: () => ({})
            }
        },

        data: () => ({
            producerData: {}
        }),

        emits: ['update:model-value', 'list'],

        computed: {
            dialog: {
                get() {
                    return this.modelValue
                },
                set(value) {
                    this.$emit('update:model-value', value)
                }
            },

            title(){
                return this.producer.id ? 'Editar produtor' : 'Cadastrar produtor'
            }
        },

        methods: {
            async saveProducer(){
                const { valid } = await this.$refs.producerForm.validate()
                if (!valid) {
                    return
                }
                
                try {
                    if(this.producerData.id){
                        await producers.updateProducer(this.producerData.id, this.producerData)
                    } else {
                        await producers.createProducer(this.producerData)
                    }
                    this.$emit('list')
                    this.$toast.success('Produtor salvo com sucesso!')
                    this.dialog = false
                } catch (error) {
                    console.error(error)
                    this.$toast.error(this.$errorApi(error))
                }
            }
        }
    }
</script>
<template>
    <v-dialog
        v-model="dialog"
        max-width="600px"
        @after-enter="producerData = { ...producer }"
        @after-leave="producerData = {}"
        persistent>
        <v-card>
            <v-toolbar color="primary" density="compact">
                <v-toolbar-title>
                    {{ title }}
                </v-toolbar-title>
                <v-toolbar-items>
                    <v-btn
                    icon="mdi-close"
                    @click="dialog = false"/>
                </v-toolbar-items>
            </v-toolbar>
            <v-card-text>
                <v-form ref="producerForm" @submit.prevent="saveProducer">
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-text-field
                                v-model="producerData.nome"
                                label="Nome do produtor"
                                :rules="[$validate.required, $validate.nome]"
                                variant="outlined"
                                density="compact"
                                hide-details="auto"
                            />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field
                                v-model="producerData.cpf_cnpj"
                                label="CPF/CNPJ"
                                :rules="[$validate.required, $validate.cpfCnpj]"
                                variant="outlined"
                                v-maska="{ mask: $masks.cpfCnpjMask(producerData.cpf_cnpj) }"
                                density="compact"
                                hide-details="auto"
                            />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field
                                v-model="producerData.telefone"
                                label="Telefone"
                                :rules="[$validate.required, $validate.telefone]"
                                variant="outlined"
                                v-maska="{ mask: $masks.telefoneMask(producerData.telefone) }"
                                density="compact"
                                hide-details="auto"
                            />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field
                                v-model="producerData.email"
                                label="Email"
                                type="email"
                                :rules="[$validate.required, $validate.email]"
                                variant="outlined"
                                density="compact"
                                hide-details="auto"
                            />
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>

                <v-spacer/>
                <v-btn
                    color="primary"
                    text="Salvar"
                    variant="flat"
                    prepend-icon="mdi-content-save"
                    @click="saveProducer"
                />
            </v-card-actions>
        </v-card>
    
    </v-dialog>

</template>