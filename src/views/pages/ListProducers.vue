<script>
import producers from '../../api/producers';

export default {
  data: () => ({
    search: '',
    dialogRegisterProducer: false,
    dialogDelete: false,
    producers: [],
    selectedProducer: {},
    producerToDelete: null
  }),

  mounted(){
    this.getProducers()
  },

  methods: {
    async getProducers(){
      try {
        const res = await producers.getProducers()
        this.producers = res
      } catch (error) {
        console.error(error)
        this.$toast.error(this.$errorApi(error))
      }
    },

    openDeleteDialog(producer){
      this.producerToDelete = producer
      this.dialogDelete = true
    },

    async deleteProducer(){
      if (!this.producerToDelete?.id) return

      try {
        await producers.deleteProducer(this.producerToDelete.id)
        this.$toast.success('Produtor excluído com sucesso!')
        this.dialogDelete = false
        this.producerToDelete = null
        await this.getProducers()
      } catch (error) {
        console.error(error)
        this.$toast.error(this.$errorApi(error))
      }
    },

    selectProducer(producer){
      localStorage.setItem('producer', producer.id)
      this.$router.push('/fazendas')
    }
  }
}
</script>
<template>
  <v-container fluid>
    <div class="text-h4 font-weight-bold mb-2">
      Qual produtor deseja atender?
    </div>

    <div class="text-subtitle-1 text-medium-emphasis mb-6">
      Selecione um produtor para acessar suas informações.
    </div>

    <v-row>
      <v-col>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar produtor"
          variant="outlined"
          density="compact"
          hide-details
          />
        
        </v-col>
      </v-row>
    <v-row>
      <v-col
        v-for="producer in producers"
        :key="producer.id"
        cols="12"
        md="6"
        lg="4"
      >
       <v-card
        hover
        rounded="xl"
        height=""
        @click="selectProducer(producer)"
        >
        <v-card-text>
          <v-row class="d-flex align-center">
            <v-col cols="4" md="2">

              <v-avatar
                color="primary"
                size="56"
                >
                <v-icon>
                  mdi-cow
                </v-icon>
              </v-avatar>
            </v-col>

            <v-col cols="8" md="10">
                <div class="text-h6">
                {{ producer.nome }}
                </div>

                <div class="text-body-2 text-medium-emphasis">
                  <v-icon>mdi-cellphone</v-icon>
                {{ producer.telefone }} 
                </div>
                <div class="text-body-2 text-medium-emphasis">
                  <v-icon>mdi-card-account-details</v-icon>
                  {{ producer.cpf_cnpj }} 
                </div>
              </v-col>
          </v-row>

            <v-divider class="my-4" />

            <div class="d-flex justify-space-between mb-2">
            <span>Lotes</span>
             <v-chip color="primary">
                {{ producer.quantidade_lotes }} 
                {{ producer.quantidade_lotes == 1 ? 'lote' : 'lotes' }}
            </v-chip>
            </div>

            <div class="d-flex justify-space-between">
            <span>Animais</span>
            <v-chip color="primary">
                {{ producer.quantidade_animais }} 
                {{ producer.quantidade_animais == 1 ? 'cabeça' : 'cabeças' }}
            </v-chip>
            </div>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn
            color="red"
            text="Deletar"
            variant="tonal"
            size="small"
            prepend-icon="mdi-trash-can"
            @click.stop="openDeleteDialog(producer)"
          />
          <v-spacer/>
          <v-btn
            color="primary"
            text="Editar"
            variant="tonal"
            size="small"
            prepend-icon="mdi-pencil"
            @click.stop="selectedProducer = producer; dialogRegisterProducer = true"
          />
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col       
        cols="12"
        md="6"
        lg="4"
      >
        <v-card 
        hover
        height="252"
        rounded="xl" 
        class="d-flex justify-center">
          <v-btn
            
            rounded
            class="w-100 h-100"
            icon="mdi-plus"
            @click="selectedProducer = {}; dialogRegisterProducer = true"/>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <dialog-register-producer
    v-model="dialogRegisterProducer"
    :producer="selectedProducer"
    @list="getProducers"
    />

  <dialog-delete
    v-model="dialogDelete"
    title="Confirmar exclusão"
    :message="producerToDelete ? `Deseja realmente excluir o produtor ${producerToDelete.nome}? Será excluído tudo relacionado a esse produtor.` : 'Deseja realmente excluir este item?'"
    confirm-text="Excluir"
    cancel-text="Cancelar"
    @confirm="deleteProducer"
  />
</template>