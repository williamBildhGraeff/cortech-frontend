<script>
import farms from '../../api/farms.js';

export default {
  data: () => ({
    search: '',
    dialogRegisterFarm: false,
    dialogDelete: false,
    farms: [],
    selectedFarm: {},
    farmToDelete: null
  }),

  mounted(){
    this.getFarms()
  },

  methods: {
    async getFarms(){
      try {
        const res = await farms.getFarmsByProducerId(this.$route.params.id)
        this.farms = res.data
      } catch (error) {
        console.error(error)
        this.$toast.error(this.$errorApi(error))
      }
    },

    openDeleteDialog(farm){
      this.farmToDelete = farm
      this.dialogDelete = true
    },

    async deleteFarm(){
      if (!this.farmToDelete?.id) return

      try {
        await farms.deleteFarm(this.$route.params.id, this.farmToDelete.id)
        this.$toast.success('Fazenda excluída com sucesso!')
        this.dialogDelete = false
        this.farmToDelete = null
        await this.getFarms()
      } catch (error) {
        console.error(error)
        this.$toast.error(this.$errorApi(error))
      }
    },

    selectFarm(farm){
      console.log(farm)
      this.$router.push({
        name: 'Lotes',
        params: { 
          producer_id: this.$route.params.id,
          farm_id: farm.id
        },
      })
    },

    formatDate(value){
      if (!value) return 'Não informado'

      return new Date(value).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    }
  }
}
</script>
<template>
  <v-container fluid>
    <v-row>
      <v-col class="pa-1" cols="12">
        <div class="text-h4 font-weight-bold ">
          Qual fazenda deseja atender?
        </div>

        <div class="text-subtitle-1 text-medium-emphasis mb-6">
          Selecione uma fazenda para acessar suas informações.
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar fazenda"
          variant="outlined"
          density="compact"
          hide-details
          />
        
        </v-col>
      </v-row>
    <v-row>
      <v-col
        v-for="farm in farms"
        :key="farm.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card
          hover
          rounded="xl"
          variant="outlined"
          class="h-100 d-flex flex-column"
          @click="selectFarm(farm)"
        >
          <v-card-text class="d-flex flex-column h-100">
            <v-row class="mb-4" align="start" justify="space-between">
              <v-col class="pa-1" cols="12" sm="8">
                <div class="d-flex align-center">
                  <v-avatar color="primary" size="48" class="me-3">
                    <v-icon>mdi-home</v-icon>
                  </v-avatar>

                  <div>
                    <div class="text-h6 font-weight-bold">
                      {{ farm.nome }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ farm.status === 'ativa' ? 'Ativa' : farm.status || 'Status não informado' }}
                    </div>
                  </div>
                </div>
              </v-col>

              <v-col cols="12" sm="4" class="pa-1 d-flex justify-sm-end justify-start">
                <v-chip
                  :color="farm.status === 'ativa' ? 'success' : 'warning'"
                  size="small"
                  variant="flat"
                >
                  {{ farm.status === 'ativa' ? 'Ativa' : 'Em análise' }}
                </v-chip>
              </v-col>
            </v-row>

            <v-row class="text-body-2 text-medium-emphasis">
              <v-col 
                cols="12" 
                class="pa-1 d-flex align-center ">
                <v-icon size="18" class="me-2">mdi-map-marker</v-icon>
                <span>
                  {{ farm.endereco?.logradouro }}, {{ farm.endereco?.numero }} - {{ farm.endereco?.bairro }}
                </span>
              </v-col>

              <v-col cols="12" class="pa-1 d-flex align-center">
                <v-icon size="18" class="me-2">mdi-city</v-icon>
                <span>{{ farm.endereco?.cidade }} - {{ farm.endereco?.uf }}</span>
              </v-col>

              <v-col cols="12" class="pa-1 d-flex align-center">
                <v-icon size="18" class="me-2">mdi-calendar-clock</v-icon>
                <span>Atualizado em {{ formatDate(farm.updated_at) }}</span>
              </v-col>
            </v-row>

            <v-divider class="my-3" />

            <v-row dense>
              <v-col cols="12" class="pa-1 d-flex flex-wrap ga-2">
                <v-chip color="primary" variant="tonal" size="small">
                  <v-icon size="16" icon="mdi-grass" />
                  {{ farm.quantidade_lotes ?? 0 }} {{ farm.quantidade_lotes == 1 ? 'lote' : 'lotes' }}
                </v-chip>

                <v-chip color="secondary" variant="tonal" size="small">
                  <v-icon size="16" icon="mdi-cow" />
                  {{ farm.quantidade_animais ?? 0 }} {{ farm.quantidade_animais == 1 ? 'cabeça' : 'cabeças' }}
                </v-chip>

                <v-chip color="info" variant="tonal" size="small">
                  <v-icon size="16" icon="mdi-ruler" />
                  {{ farm.area_total_hectares ? `${farm.area_total_hectares} ha` : 'Área não informada' }}
                </v-chip>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider />

          <v-card-actions class="px-4 pb-4">
            <v-btn
              color="red"
              text="Deletar"
              variant="tonal"
              size="small"
              prepend-icon="mdi-trash-can"
              @click.stop="openDeleteDialog(farm)"
            />
            <v-spacer />
            <v-btn
              color="primary"
              text="Editar"
              variant="tonal"
              size="small"
              prepend-icon="mdi-pencil"
              @click.stop="selectedFarm = farm; dialogRegisterFarm = true"
            />
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col class="pa-1"       
        cols="12"
        md="6"
        lg="4"
      >
        <v-card 
        hover
        height="373"
        rounded="xl" 
        class="d-flex justify-center">
          <v-btn
            
            rounded
            class="w-100 h-100"
            icon="mdi-plus"
            @click="selectedFarm = {}; dialogRegisterFarm = true"/>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <dialog-register-farm
    v-model="dialogRegisterFarm"
    :farm="selectedFarm"
    @list="getFarms"
    />

  <dialog-delete
    v-model="dialogDelete"
    title="Confirmar exclusão"
    :message="farmToDelete ? `Deseja realmente excluir a fazenda ${farmToDelete.nome}? Será excluído tudo relacionado a essa fazenda.` : 'Deseja realmente excluir este item?'"
    confirm-text="Excluir"
    cancel-text="Cancelar"
    @confirm="deleteFarm"
  />
</template>