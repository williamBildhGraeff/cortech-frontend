<script>
import weighings from '../../api/weighings'

export default {
    data: () => ({
        pesagens: [],
        headers: [
            {title: '#', value: 'id'},
            { title: 'Brinco', value:'brinco'},
            { title: 'Classifição', value:'classificacao'},
            { title: 'Data', value:'data'},
            { title: 'GMD Calculado', value:'gmd_calculado_automatico'},
            { title: 'Origem', value:'origem'},
            { title: 'Ações', value:'actions', align:'end'},
        ],
        showMenu: false,
        dialogWeighing: false,
        dialogRegisterWeighing: false, 
        animal: {},
        pesagem: {},
        dialogDelete: false,
        dialogImport: false,
        weightingToDelete: {},
        file: null,
        loading: false,
        dialogConfirmImport: false
    }),

    computed:{
        heigthTable(){
            return 'calc(100vh - 188px)'
        },
    },

    methods:{
       async getWeighing(){
            try {
                const lote_id = localStorage.getItem('lot')
                const response = await weighings.getWeighingByLotId(lote_id)
                this.pesagens = response.data.pesagens
            } catch (error) {
                console.error(error)
                this.$toast.error(this.$errorApi(error))
            }
        },

        async exportWeighing(){
            try {
                this.loading = true
                const lote_id = localStorage.getItem('lot')
                const response = await weighings.exportWeighing({lote_id:lote_id})
                 const blob = new Blob(
                    [response.data],
                    { type: 'text/csv;charset=utf-8;' }
                )
                const url = window.URL.createObjectURL(blob)

                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', `pesagens-lote-${lote_id}.csv`)

                document.body.appendChild(link)
                link.click()

                link.remove()
                window.URL.revokeObjectURL(url)
                this.$toast.success('Sucesso ao exportar as pesagens desse lote!')
            } catch (error) {
                console.error(error)
                this.$toast.error(this.$errorApi(error))
            } finally {
                this.loading = false
            }
        },

        async importWeighing(){
            try {
                this.loading = true
                const formData = new FormData()
                formData.append('file', this.file)
                await weighings.importWeighing(formData)
                this.$toast.success('Sucesso ao importar as pesagens!')
                this.getWeighing()
                this.file = null
            } catch (error) {
                console.error(error)
                this.$toast.error(this.$errorApi(error))
            } finally {
                this.loading = false
            }
        },

        confirmImport(){
            this.importWeighing()
        },

        deleteWeighting(item){
			this.weightingToDelete = {...item}
			this.dialogDelete = true
		},

        async deletarPesagem() {
			try {
				await weighings.deleteWeighing(this.weightingToDelete.id)
				this.$toast.success('Sucesso ao inserir a pesagem!')
				this.getWeighing()
				this.dialogDelete = false
			} catch (error) {
				console.error(error)
				this.$toast.error(this.$errorApi(error))
			}
		},

        openDialogRegister(item = {}){
            this.pesagem = item
            this.dialogRegisterWeighing = true
        },

        openDialogWeighing(item){
            this.animal = {
                ...item,
                id: item.animal
            }
            this.dialogWeighing = true
        },
    },

    mounted(){
        this.getWeighing()
    }
}

</script>
<template>
    <v-container fluid>
        <v-row>
            <v-spacer/>
            <v-col cols="12" md="6" class="text-end justify-space-between d-flex">
                 <v-btn
                    color="success"
                    variant="flat"
                    :loading
                    text="Exportar Pesagem"
                    prepend-icon="mdi-file-export-outline"
                    @click="exportWeighing"/>
                 <v-btn
                    color="red"
                    variant="flat"
                    text="Importar Pesagem"
                    prepend-icon="mdi-file-import-outline"
                    @click="dialogImport = true"/>
                <v-btn
                    color="primary"
                    variant="flat"
                    text="Adicionar Pesagem"
                    prepend-icon="mdi-weight-kilogram"
                    @click="openDialogRegister"/>
            </v-col>
            <v-col cols="12">
                <v-card>
                    <v-data-table
                    :items="pesagens"
                    :height="heigthTable"
                    density="compact"
                    :loading
                    :headers>
                     <template #[`item.origem`]="{item}">
                        <v-chip
                            color="primary"
                            variant="tonal"
                            class="text-capitalize"
                            :text="item.origem == 'importacao' ? 'Importação' : item.origem"
                        />
                    </template>
                    <template #[`item.data`]="{item}">
                        <v-chip
                        color="success"
                        prepend-icon="mdi-calendar"
                        :text="$formatTimestamp.formatDateTime(item.data)"
                        />
                    </template>
                     <template #[`item.gmd_calculado_automatico`]="{item}">
                        <v-chip
                        :prepend-icon="`${item.gmd_calculado_automatico ? 'mdi-speedometer' : 'mdi-close'}`"
                        :color="`${item.gmd_calculado_automatico ? 'warning' : 'red'}`"
                        :text="`${item.gmd_calculado_automatico ? item.gmd_calculado_automatico + ' kg/dia' : 'indisponível'}`"
                        />
                    </template>
                    <template #[`item.actions`]="{item}">
                            <v-menu
                                location="bottom end"
                                :offset="[-8, -12]"
                                scroll-strategy="close"
                            >
                                <template #activator="{ props }">
                                    <v-icon-btn
                                        v-bind="props"
                                        v-tooltip="'Ações'"
                                        rounded
                                        icon="mdi-dots-vertical"
                                    />
                                </template>

                                <v-list
                                    density="compact"
                                    slim
                                    class="py-0"
                                >
                                    <v-list-item
                                        prepend-icon="mdi-eye"
                                        title="Visualizar pesagens do animal"
                                        @click="openDialogWeighing(item)"
                                    />
                                    
                                    <v-divider />

                                    <v-list-item
                                        prepend-icon="mdi-pen"
                                        title="Editar"
                                        @click="openDialogRegister(item)"
                                    />

                                    <v-divider />

                                    <v-list-item
                                        prepend-icon="mdi-trash-can"
                                        title="Remover"
                                        @click="deleteWeighting(item)"
                                    />
                                </v-list>
                            </v-menu>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
    <dialog-register-weighing 
        v-model="dialogRegisterWeighing" 
        @listar="getWeighing"
        :pesagem-edit="pesagem"/>
    <dialog-weighing v-model="dialogWeighing" :animal/>
    <dialog-import-files 
        v-model="dialogImport" 
        v-model:file-to-upload="file" 
        :import="confirmImport"/>
    <dialog-delete
		v-model="dialogDelete"
		title="Confirmar exclusão"
		message="Deseja realmente excluir este item?"
		confirm-text="Excluir"
		cancel-text="Cancelar"
		@confirm="deletarPesagem"
	/>
    <dialog-delete
		v-model="dialogConfirmImport"
		title="Confirmar"
		message="Você garante que esse arquivo possui os dadossomente deste lote? Caso os animais pertencerem a outro lote haverá inconsistencia nos dados!"
		confirm-text="Confirmar"
		cancel-text="Cancelar"
		@confirm="importWeighing"
	/>
</template>