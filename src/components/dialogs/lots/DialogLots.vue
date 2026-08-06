<script>
import lots from '../../../api/lots';

export default {
  name: 'DialogLots',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },

    lot: {
      type: Object,
      default: () => ({})
    },

    farmId: {
      type: Number,
      required: true
    }
  },

  emits: ['update:modelValue', 'lot-saved'],
  data:()=>({
    lote: {}
  }),

  computed: {
    dialog: {
      get(){
        return this.modelValue
      },

      set(value){
        this.$emit('update:modelValue', value)
      }
    },

    title() {
      return this.lot.status === 'vendido' ? 'Detalhes do lote' : this.lot.id ? 'Editar lote' : 'Novo lote'
    }
  },

  methods: {
    async saveLot() {
      try {
        const lote = {
          ...this.lote,
          data_entrada: this.lote.data_entrada ? this.$formatTimestamp.formatDateTimeUSA(this.lote.data_entrada) : null,
          data_saida: this.lote.data_saida ? this.$formatTimestamp.formatDateTimeUSA(this.lote.data_saida) : null,
          fazenda: this.farmId
        }
        if(this.lot.id) {
          await lots.updateLot(this.farmId, lote)
        } else {
          await lots.createLot(this.farmId, lote)
        }
        this.$toast.success('Lote salvo com sucesso!')
        this.$emit('lot-saved')
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
      max-width="600" 
      persistent 
      @after-leave="lote = {}"
      @after-enter="lote = { ... lot}">
        <v-card>
          <v-toolbar color="primary" density="compact">
            <v-toolbar-title>
              <v-icon size="small" class="me-2 mb-2" icon="mdi-fence"/>
              {{ title }}
            </v-toolbar-title>
            <v-toolbar-items>
              <v-btn
              icon="mdi-close"
              @click="dialog = false"/>
            </v-toolbar-items>
          </v-toolbar>
            <v-card-text class="pa-1">
              <v-row >
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="lote.nome"
                    label="Nome do Lote"
                    prepend-inner-icon="mdi-tag"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-date-input
                    v-model="lote.data_entrada"
                    label="Data de Entrada"
                    prepend-inner-icon="mdi-calendar-import"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-date-input
                    v-model="lote.data_saida"
                    label="Data de Saída"
                    prepend-inner-icon="mdi-calendar-export"
                    clearable
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="lote.raca_majoritaria"
                    label="Raça Majoritária"
                    prepend-inner-icon="mdi-cow"
                  />
                </v-col>

                <v-col cols="12" md="6" v-if="lote.id">
                  <select-status-lots  v-model="lote.status" />
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-btn 
                variant="flat" 
                color="red" 
                text="Fechar"
                prepend-icon="mdi-close"
                @click="dialog = false"/>
              <v-spacer></v-spacer>
              <v-btn 
                variant="flat" 
                color="success" 
                text="Salvar"
                prepend-icon="mdi-content-save"
                @click="saveLot"/>
            </v-card-actions>
        </v-card>

    </v-dialog>
</template>