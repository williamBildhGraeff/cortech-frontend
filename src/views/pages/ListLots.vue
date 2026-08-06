<script>
import lots from '../../api/lots';

export default {
  data: () => ({
    search: '',
    loading: false,
    lots: [],
    selectedLot: {},
    farm_id: null,
    openDialog: false
  }),

  computed: {
    summary() {
      return {
        total: this.lots.length,
        ativos: this.lots.filter((lot) => lot.status === 'ativo').length,
        comSaida: this.lots.filter((lot) => lot.data_saida).length,
        semSaida: this.lots.filter((lot) => !lot.data_saida).length
      }
    }
  },

  mounted() {
    this.farm_id = this.$route.params.farm_id
    this.getLots()
  },

  methods: {
    async getLots() {
        this.loading = true
        try {
            const response = await lots.getLots(this.farm_id)
            this.lots = response
        }catch(error) {
            console.error(error)
            this.$toast.error(this.$errorApi(error))
        } finally {
            this.loading = false
        }
    },

    goBack() {
      this.$router.push({
        name: 'Fazendas',
        params: { id: this.$route.params.producer_id }
      })
    },

    statusLabel(status) {
      switch (status) {
        case 'ativo':
          return 'Ativo'
        case 'vendido':
          return 'Vendido'
        default:
          return 'Sem status'
      }
    },

    statusColor(status) {
      switch (status) {
        case 'ativo':
          return 'success'
        case 'vendido':
          return 'warning'
        default:
          return 'secondary'
      }
    },

    formatDate(value) {
      if (!value) return 'Não informado'

      return new Date(value).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    },

    formatValue(value, fallback = 'Não informado') {
      if (value === null || value === undefined || value === '') return fallback
      return value
    }
  }
}
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" class="pb-2">
        <v-row class="align-start align-md-center mb-4" dense>
          <v-col cols="12" md="8">
            <v-row dense>
              <v-col cols="12" class="text-h4 font-weight-bold">
                Lotes da fazenda
              </v-col>
              <v-col cols="12" class="text-subtitle-1 text-medium-emphasis">
                Encontre rapidamente o lote certo sem perder o contexto da fazenda.
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" md="4" class="d-flex gap-2 justify-start justify-md-end">
            <v-btn
              variant="outlined"
              prepend-icon="mdi-arrow-left"
              @click="goBack"
            >
              Voltar
            </v-btn>

            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="selectedLot = {}, openDialog = true"
            >
              Novo lote
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="3">
        <v-card rounded="xl" variant="tonal" class="h-100">
          <v-card-text>
            <div class="text-caption text-medium-emphasis">Total de lotes</div>
            <div class="text-h5 font-weight-bold mt-1">{{ summary.total }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card rounded="xl" variant="tonal" class="h-100">
          <v-card-text>
            <div class="text-caption text-medium-emphasis">Ativos</div>
            <div class="text-h5 font-weight-bold mt-1">{{ summary.ativos }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card rounded="xl" variant="tonal" class="h-100">
          <v-card-text>
            <div class="text-caption text-medium-emphasis">Com saída</div>
            <div class="text-h5 font-weight-bold mt-1">{{ summary.comSaida }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card rounded="xl" variant="tonal" class="h-100">
          <v-card-text>
            <div class="text-caption text-medium-emphasis">Sem saída</div>
            <div class="text-h5 font-weight-bold mt-1">{{ summary.semSaida }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card rounded="xl" variant="outlined" class="pa-3">
          <v-row class="align-center" dense>
            <v-col cols="12" md="8">
              <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                label="Buscar lote"
                variant="outlined"
                density="compact"
                hide-details
                class="flex-grow-1"
              />
            </v-col>

            <v-col cols="12" md="4" class="d-flex justify-start justify-md-end">
              <v-chip color="primary" variant="flat">
                {{ lots.length }} {{ lots.length === 1 ? 'lote' : 'lotes' }} encontrados
              </v-chip>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="loading">
      <v-col cols="12" md="6" lg="4" v-for="n in 3" :key="n">
        <v-card rounded="xl" variant="outlined" class="pa-4">
          <v-skeleton-loader type="article" />
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else-if="lots.length">
      <v-col v-for="lot in lots" :key="lot.id" cols="12" md="6" lg="4">
        <v-card hover rounded="xl" variant="outlined" class="h-100">
          <v-card-text>
            <v-row class="mb-3" dense>
              <v-col cols="8">
                <div class="text-h6 font-weight-bold">{{ lot.nome || 'Lote sem nome' }}</div>
                <div class="text-caption text-medium-emphasis">
                  {{ lot.fazenda ? `Fazenda ${lot.fazenda}` : 'Fazenda não informada' }}
                </div>
              </v-col>

              <v-col cols="4" class="d-flex justify-end">
                <v-chip :color="statusColor(lot.status)" size="small" variant="flat">
                  {{ statusLabel(lot.status) }}
                </v-chip>
              </v-col>
            </v-row>

            <v-row dense class="text-body-2 text-medium-emphasis">
              <v-col cols="12" class="d-flex align-center">
                <v-icon size="18" class="me-2">mdi-calendar-plus</v-icon>
                <span>Entrada: {{ formatDate(lot.data_entrada) }}</span>
              </v-col>

              <v-col cols="12" class="d-flex align-center">
                <v-icon size="18" class="me-2">mdi-calendar-remove</v-icon>
                <span>Saída: {{ lot.data_saida ? formatDate(lot.data_saida) : 'Não registrada' }}</span>
              </v-col>

              <v-col cols="12" class="d-flex align-center">
                <v-icon size="18" class="me-2">mdi-scale-balance</v-icon>
                <span>Peso médio: {{ formatValue(lot.peso_medio) }}</span>
              </v-col>

              <v-col cols="12" class="d-flex align-center">
                <v-icon size="18" class="me-2">mdi-cow</v-icon>
                <span>Animais: {{ lot.quantidade_animais }}</span>
              </v-col>

              <v-col cols="12" class="d-flex align-center">
                <v-icon size="18" class="me-2">mdi-horse-human</v-icon>
                <span>Raça: {{ formatValue(lot.raca_majoritaria) }}</span>
              </v-col>

              <v-col cols="12" class="d-flex align-center">
                <v-icon size="18" class="me-2">mdi-chart-line</v-icon>
                <span>GMD médio: {{ formatValue(lot.gmd_medio) }}</span>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider />

          <v-card-actions class="justify-space-between">
            <span class="text-caption text-medium-emphasis">Atualizado {{ formatDate(lot.updated_at) }}</span>
            <div>
              <v-btn 
                color="primary" 
                variant="flat" 
                prepend-icon="mdi-cow"
                text="Rebanho"/>
              <v-btn 
                color="secondary" 
                variant="text"
                :text="lot.status === 'vendido' ? 'Informações' : 'Editar'" 
                :prepend-icon="lot.status === 'vendido' ? 'mdi-eye-outline' : 'mdi-pencil-outline'"
                @click="selectedLot = lot, openDialog = true"
                />
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <v-card rounded="xl" variant="outlined" class="py-10 text-center">
          <v-row dense justify="center">
            <v-col cols="12">
              <v-icon size="64" color="primary">mdi-cow</v-icon>
            </v-col>
            <v-col cols="12" class="text-h6 mt-4">
              Nenhum lote encontrado
            </v-col>
            <v-col cols="12" class="text-body-2 text-medium-emphasis mt-2">
              Tente ajustar a busca ou cadastre um novo lote para começar.
            </v-col>
            <v-col cols="12">
              <v-btn color="primary" class="mt-4" prepend-icon="mdi-plus">
                Cadastrar lote
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <dialog-lots 
    v-model="openDialog" 
    :lot="selectedLot" 
    @lot-saved="getLots"
    :farm-id="farm_id"/>
</template>
