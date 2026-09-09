<script>
import animals from '../../api/animals';

export default {
    data: ()=>({
        animals: [],
        animal: null,
        dialogRegister: false,
        dialogWeighing: false,
        headers: [
            { title: '#', key: 'id' },
            { title: 'Brinco', key: 'brinco' },
            { title: 'Sexo', key: 'sexo' },
            { title: 'Categoria', key: 'categoria' },
            { title: 'Raça', key: 'raca' },
            { title: 'Origem', key: 'origem' },
            { title: 'Idade', key: 'idade' },
            { title: 'Status', key: 'status' },
            { title: 'Ações', key: 'actions', align: 'center' },
        ]
    }),

    computed: {
        heigthTable(){
            return 'calc(100vh - 188px)'
        },
        statusAnimal() {
            return {
                ativo: { color: 'success', icon: 'mdi-check', text: 'Ativo' },
                vendido: { color: 'info', icon: 'mdi-cash-check', text: 'Vendido' },
                morto: { color: 'error', icon: 'mdi-skull-crossbones-outline', text: 'Morto' },
                transferido: { color: 'warning', icon: 'mdi-transfer', text: 'Transferido' },
            }
        }
    },

    methods: {
        async getAnimals(){
            try {
                const response = await animals.getAnimals()
                this.animals = response
            } catch (error) {
                console.error(error)
                this.$toast.error(this.$errorApi(error))
            }
        },

        openDialogWeighing(animal){
            this.animal = animal
            this.dialogWeighing = true
        },

        openDialog(item = {}){
            this.animal = item
            this.dialogRegister = true
        }
    },

    mounted(){
        this.getAnimals()
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
                    text="Adicionar Animal"
                    prepend-icon="mdi-cow"
                    @click="openDialog()"/>
            </v-col>
            <v-col>
                <v-card variant="elevated">
                    <v-data-table 
                    :items="animals"
                    :headers
                    :height="heigthTable"
                    density="compact">
                        <template #[`item.sexo`]="{item}">
                            <v-chip
                            :text="item.sexo === 'M' ? 'Macho' : 'Fêmea'"/>
                        </template>
                         <template #[`item.categoria`]="{item}">
                            <span class="text-capitalize">{{ item.categoria }}</span>
                        </template>
                            <template #[`item.origem`]="{item}">
                            <span class="text-capitalize">{{ item.origem }}</span>
                        </template>
                        <template #[`item.idade`]="{item}">
                            <v-chip
                            :color="item.idade === 'maior_12_meses' ? 
                            'warning' : 'success'"
                            :text="item.idade === 'maior_12_meses' ? 
                            'Maior que 12 meses' : 'Menor que 12 meses'" 
                            :prepend-icon="item.idade === 'maior_12_meses' ? 
                            'mdi-warning' : 'mdi-check'"
                            />
                        </template>
                        <template #[`item.status`]="{item}">
                            <v-chip
                            :color="statusAnimal[item.status].color"
                            :text="statusAnimal[item.status].text" 
                            :prepend-icon="statusAnimal[item.status].icon"
                            />
                        </template>
                        <template #[`item.actions`]="{item}">
                           <v-btn 
                                v-tooltip="'Editar animal'"
                                class="me-2"
                                icon="mdi-pen"
                                rounded=""
                                size="x-small"
                                variant="tonal"
                                color="warning"
                                @click="openDialog(item)"/>
                            <v-btn 
                                v-tooltip="'Pesagens do animal'"
                                icon="mdi-weight-kilogram"
                                rounded=""
                                size="x-small" 
                                variant="tonal"
                                color="primary"
                                @click="openDialogWeighing(item)"/>

                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
    <dialog-weighing v-model="dialogWeighing" :animal/>
    <dialog-register-animal v-model="dialogRegister" :animal @list="getAnimals" />
</template>