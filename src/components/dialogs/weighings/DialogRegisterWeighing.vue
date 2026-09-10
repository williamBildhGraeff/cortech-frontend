<script>
import weighings from '../../../api/weighings';

export default {
    props: {
        modelValue: {
            type: Boolean,
            default: false
        },

        pesagemEdit: {
            type: Object,
            default: () => ({})
        }
    },

    emits: ['update:model-value', 'listar'],

    data() {
        return {
            pesagem: this.getInitialPesagem(),
            loading: false
        }
    },

    computed: {
        dialog: {
            get(){
                return this.modelValue
            },

            set(value) {
                this.$emit('update:model-value', value)
            }
        },

        title() {
            return this.pesagemEdit.id ? 'Editar pesagem' : 'Registrar pesagem' 
        }
    },

    methods: {
        getInitialPesagem() {
			return {
				data: this.getToday(),
				peso: null,
				classificacao: null,
				origem: 'manual',
			}
		},

        getToday() {
			const date = new Date()

			return `${date.getFullYear()}-${String(
				date.getMonth() + 1
			).padStart(2, '0')}-${String(
				date.getDate()
			).padStart(2, '0')}`
		},

        async salvar() {
			const { valid } = await this.$refs.form.validate()
			if (!valid) return
			try {
				if(!this.pesagem?.id){
					await weighings.createWeighing(this.pesagem)
					this.$toast.success('Sucesso ao inserir a pesagem!')
				} else {
					await weighings.updateWeighing(this.pesagem.id, this.pesagem)
					this.$toast.success('Sucesso ao atualizar a pesagem!')
				}
				this.pesagem = this.getInitialPesagem()
                this.$emit('listar')
			} catch (error) {
				console.error(error)
				this.$toast.error(this.$errorApi(error))
			}
		},
    }
}

</script>
<template>
    <v-dialog 
        v-model="dialog"
        @after-leave="pesagem = getInitialPesagem()"
        @after-enter="pesagem = { ...pesagemEdit }"
        max-width="1100"
	>
		<v-card>
			<v-toolbar class="d-flex align-center" density="compact" color="primary">
                <v-toolbar-title>
                    <v-icon
					icon="mdi-scale-balance"
					class="me-3"
                    />
                    {{ title }}
                </v-toolbar-title>

				<v-toolbar-items>
                    <v-btn
					icon="mdi-close"
					variant="text"
					@click="dialog = false"
                    />
                </v-toolbar-items>
			</v-toolbar>
            <v-card-text>
                <v-form ref="form">
                    <v-row>
                         <v-col
                            cols="12"  
                            sm="6"
                            md="3"
                        >
                            <select-animal v-model="pesagem.animal"/>
                        </v-col>
                        <v-col
                            cols="12"  
                            sm="6"
                            md="3"
                        >
                            <v-text-field
                                v-model="
                                    pesagem.data
                                "
                                label="Data"
                                type="date"
                                variant="outlined"
                                :rules="[$validate.required]"
                            />
                        </v-col>

                        <v-col
                            cols="12"
                            sm="6"
                            md="3"
                        >
                            <v-text-field
                                v-model="
                                    pesagem.peso
                                "
                                label="Peso"
                                type="number"
                                min="0"
                                step="0.01"
                                suffix="kg"
                                variant="outlined"
                                :rules="[$validate.peso]"
                            />
                        </v-col>

                        <v-col
                            cols="12"
                            sm="6"
                            md="3"
                        >
                            <v-text-field
                                v-model="
                                    pesagem.classificacao
                                "
                                label="Classificação"
                                maxlength="10"
                                variant="outlined"
                            />
                        </v-col>

                        <v-col
                            cols="12"
                            class="d-flex align-center justify-end"
                        >
                            <v-btn
                                color="primary"
                                variant="flat"
                                :loading="loading"
                                @click="salvar"
                                prepend-icon="mdi-content-save"
                                text="Salvar pesagem"
                            />
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>

</template>