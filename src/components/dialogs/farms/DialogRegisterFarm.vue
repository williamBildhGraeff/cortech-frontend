<script>
import farms from '@/api/farms'

export default {
    name: 'DialogRegisterFarm',
    props: {
        modelValue: {
            type: Boolean,
            required: true
        },

        farm: {
            type: Object,
            default: () => ({})
        }
    },

    data: () => ({
        farmData: {
            endereco: {}
        }
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
            return this.farm.id ? 'Editar fazenda' : 'Cadastrar fazenda'
        }
    },

    methods: {
        async saveFarm(){
            const { valid } = await this.$refs.farmForm.validate()
            if (!valid) {
                return
            }

            try {
                const payload = {
                    ...this.farmData,
                    endereco: {
                        ...(this.farmData.endereco || {})
                    },
                    produtor: this.$route.params.id
                }

                if (this.farmData.id) {
                    await farms.updateFarm(this.$route.params.id, this.farmData.id, payload)
                } else {
                    await farms.createFarm(this.$route.params.id, payload)
                }

                this.$emit('list')
                this.$toast.success('Fazenda salva com sucesso!')
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
        max-width="760px"
        @after-enter="farmData = { endereco: {}, ...farm }"
        @after-leave="farmData = { endereco: {} }"
        persistent>
        <v-card>
            <v-toolbar color="primary" density="compact">
                <v-toolbar-title>
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
                <v-form ref="farmForm" @submit.prevent="saveFarm">
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-text-field
                                v-model="farmData.nome"
                                label="Nome da fazenda"
                                :rules="[$validate.required, $validate.nome]"
                                variant="outlined"
                                density="compact"
                                hide-details="auto"
                            />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field
                                v-model="farmData.codigo"
                                label="Código"
                                variant="outlined"
                                density="compact"
                                hide-details="auto"
                            />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field
                                v-model="farmData.area_total_hectares"
                                label="Área total (ha)"
                                type="number"
                                variant="outlined"
                                density="compact"
                                hide-details="auto"
                            />
                        </v-col>
                    </v-row>

                    <v-divider class="my-4" />

                    <div class="text-subtitle-1 font-weight-medium mb-3">Endereço</div>

                    <v-row>
                        <v-col cols="12" md="6">
                            <v-text-field
                                v-model="farmData.endereco.logradouro"
                                label="Logradouro"
                                :rules="[$validate.required]"
                                variant="outlined"
                                density="compact"
                                hide-details="auto"
                            />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field
                                v-model="farmData.endereco.numero"
                                label="Número"
                                :rules="[$validate.required]"
                                variant="outlined"
                                density="compact"
                                hide-details="auto"
                            />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field
                                v-model="farmData.endereco.bairro"
                                label="Bairro"
                                :rules="[$validate.required]"
                                variant="outlined"
                                density="compact"
                                hide-details="auto"
                            />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field
                                v-model="farmData.endereco.cidade"
                                label="Cidade"
                                :rules="[$validate.required]"
                                variant="outlined"
                                density="compact"
                                hide-details="auto"
                            />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field
                                v-model="farmData.endereco.uf"
                                label="UF"
                                :rules="[$validate.required]"
                                variant="outlined"
                                density="compact"
                                hide-details="auto"
                            />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field
                                v-model="farmData.endereco.cep"
                                label="CEP"
                                :rules="[$validate.required]"
                                variant="outlined"
                                density="compact"
                                hide-details="auto"
                            />
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn
                    color="primary"
                    text="Salvar"
                    variant="flat"
                    prepend-icon="mdi-content-save"
                    @click="saveFarm"
                />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>