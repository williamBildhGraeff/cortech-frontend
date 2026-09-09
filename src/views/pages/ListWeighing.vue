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
        animal: {},
        dialogDelete: false,
        weightingToDelete: {}
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
                this.pesagens = response.data
            } catch (error) {
                console.error(error)
                this.$toast.error(this.$errorApi(error))
            }
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
            <v-col cols="12" class="text-end">
                <v-btn
                    color="primary"
                    variant="flat"
                    text="Adicionar Pesagem"
                    prepend-icon="mdi-weight-kilogram"/>
            </v-col>
            <v-col cols="12">
                <v-card>
                    <v-data-table
                    :items="pesagens"
                    :height="heigthTable"
                    density="compact"
                    :headers>
                     <template #[`item.origem`]="{item}">
                        <v-chip
                            color="primary"
                            variant="tonal"
                            class="text-capitalize"
                            :text="item.origem"
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
                        prepend-icon="mdi-speedometer"
                        color="warning"
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
    
    <dialog-weighing v-model="dialogWeighing" :animal/>
    	<dialog-delete
		v-model="dialogDelete"
		title="Confirmar exclusão"
		message="Deseja realmente excluir este item?"
		confirm-text="Excluir"
		cancel-text="Cancelar"
		@confirm="deletarPesagem"
	/>
</template>