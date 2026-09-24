<script>
import Chart from 'chart.js/auto'
import pesagens from '@/api/weighings'

export default {
  name: 'DashboardLote',

  data () {
    return {
      loading: false,

      analise: {
        gmd_medio: null,
        estatisticas: null,
        animais_gmd: [],
        outliers: []
      },

      chart: null,

      outlierHeaders: [
        {
          title: 'Animal',
          key: 'animal_id'
        },
        {
          title: 'Brinco',
          key: 'brinco'
        },
        {
          title: 'GMD',
          key: 'gmd'
        },
        {
          title: 'Classificação',
          key: 'tipo'
        }
      ]
    }
  },

  computed: {
    estatisticas () {
      return this.analise.estatisticas
    },

    animais () {
      return this.analise.animais_gmd || []
    },

    outliers () {
      return this.analise.outliers || []
    },

    amplitude () {
      if (!this.estatisticas) {
        return '-'
      }

      const valor =
        Number(this.estatisticas.maximo) -
        Number(this.estatisticas.minimo)

      return valor.toFixed(2)
    }
  },

  async mounted () {
    await this.carregarAnalise()
  },

  beforeUnmount () {
    if (this.chart) {
      this.chart.destroy()
    }
  },

  methods: {
    async carregarAnalise () {
      this.loading = true

      try {
        const loteId = localStorage.getItem('lot')

        const response = await pesagens.getWeighingByLotId(loteId)

        this.analise = response.data.analise || {
          gmd_medio: null,
          estatisticas: null,
          animais_gmd: [],
          outliers: []
        }

        await this.$nextTick()

        this.criarGrafico()
      } catch (error) {
        console.error(error)

        this.$toast.error(
          this.$errorApi(error)
        )
      } finally {
        this.loading = false
      }
    },

    criarGrafico () {
      if (!this.$refs.gmdChart) {
        return
      }

      if (this.chart) {
        this.chart.destroy()
      }

      this.chart = new Chart(
        this.$refs.gmdChart,
        {
          type: 'bar',

          data: {
            labels: this.animais.map(
              animal => animal.brinco
            ),

            datasets: [
              {
                label: 'GMD kg/dia',

                data: this.animais.map(
                  animal => animal.gmd
                ),

                borderWidth: 1
              }
            ]
          },

          options: {
            responsive: true,

            maintainAspectRatio: false,

            plugins: {
              legend: {
                display: false
              }
            },

            scales: {
              y: {
                beginAtZero: true,

                title: {
                  display: true,
                  text: 'GMD (kg/dia)'
                }
              },

              x: {
                ticks: {
                  maxRotation: 45,
                  minRotation: 45
                },

                title: {
                  display: true,
                  text: 'Brinco'
                }
              }
            }
          }
        }
      )
    },
  }
}
</script>
<template>
<v-container fluid>
  <v-row align="center">
    <v-col cols="12" md="6">
      <v-card-title class="text-h5 font-weight-bold">
        Indicadores de desempenho e análise estatística
      </v-card-title>
    </v-col>
     <v-col cols="12" md="6" class="pt-1 d-flex justify-end">
        <v-btn 
          text="Atualizar"
          :loading
          color="primary"
          prepend-icon="mdi-reload"
          @click="carregarAnalise"/>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" md="3">
      <v-card
        color="primary"
        variant="elevated"
        rounded="lg"
      >
       	<v-card
							class="d-flex justify-center"
							color="primary"
						>
							<v-list-item
								prepend-icon="mdi-speedometer"
								title="GMD Médio do lote"
								:subtitle="
									analise.gmd_medio
										? `${analise.gmd_medio} kg/dia`
										: '-'
								"
							/>
						</v-card>
      </v-card>
    </v-col>
    <v-col cols="12" md="3">
      <v-card
        color="primary"
        variant="elevated"
        rounded="lg"
      >
       	<v-card
							class="d-flex justify-center"
							color="info"
						>
							<v-list-item
								prepend-icon="mdi-cow"
								title="Animais analisados"
								:subtitle="
									animais.length
										? `${animais.length} com GMD calculado`
										: '-'
								"
							/>
						</v-card>
      </v-card>
    </v-col>
    <v-col cols="12" md="3">
      <v-card
        color="primary"
        variant="elevated"
        rounded="lg"
      >
       	<v-card
							class="d-flex justify-center"
							color="success"
						>
							<v-list-item
								prepend-icon="mdi-trending-up"
								title="Maior GMD"
								:subtitle="
									estatisticas?.maximo
										? `${estatisticas?.maximo} Kg/dia, melhor desempenho`
										: '-'
								"
							/>
						</v-card>
      </v-card>
    </v-col>
    <v-col cols="12" md="3">
      <v-card
        color="primary"
        variant="elevated"
        rounded="lg"
      >
       	<v-card
							class="d-flex justify-center"
							color="red"
						>
							<v-list-item
								prepend-icon="mdi-trending-down"
								title="Menor GMD"
								:subtitle="
									estatisticas?.minimo
										? `${estatisticas?.minimo} Kg/dia, menor desempenho`
										: '-'
								"
							/>
						</v-card>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
        <v-card>
          <v-card-item>
            <v-card-title class="text-subtitle-1 font-weight-bold">
              GMD por animal
            </v-card-title>

            <v-card-subtitle>
              Comparação do ganho médio diário entre os animais
            </v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <v-sheet
              height="320"
              class="d-flex align-center justify-center"
            >
              <canvas
                ref="gmdChart"
              />
            </v-sheet>
          </v-card-text>
        </v-card>
      </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" md="6">
      <v-card
        title="Estatística descritiva"
        subtitle="Medidas de tendência e dispersão ">
        <v-card-text>
          <v-row>
            <v-col cols="6">
                <v-list-item
                  prepend-icon="mdi-chart-bell-curve"
                  title="Média"
                  :subtitle="estatisticas?.media + ' kg/dia' || '-'"
                />
              </v-col>

              <v-col cols="6">
                <v-list-item
                  prepend-icon="mdi-chart-line"
                  title="Mediana"
                  :subtitle="estatisticas?.mediana + ' kg/dia' || '-'"
                />
              </v-col>

              <v-col cols="6">
                <v-list-item
                  prepend-icon="mdi-chart-bell-curve-cumulative"
                  title="Desvio padrão"
                  :subtitle="estatisticas?.desvio_padrao + ' kg/dia'|| '-'"
                />
              </v-col>

              <v-col cols="6">
                <v-list-item
                  prepend-icon="mdi-arrow-down"
                  title="Mínimo"
                  :subtitle="estatisticas?.minimo + ' kg/dia' || '-'"
                />
              </v-col>

              <v-col cols="6">
                <v-list-item
                  prepend-icon="mdi-arrow-up"
                  title="Máximo"
                  :subtitle="estatisticas?.maximo + ' kg/dia' || '-'"
                />
              </v-col>

              <v-col cols="6">
                <v-list-item
                  prepend-icon="mdi-chart-box"
                  title="Amplitude"
                  :subtitle="amplitude + ' kg/dia' || '-'"
                />
              </v-col>
          </v-row>
          
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="6">
      <v-card
        title="Estatística descritiva"
        subtitle="Medidas de tendência e dispersão ">
        <v-card-text>
          <v-row>
            <v-col cols="6">
                <v-list-item
                  title="Q1"
                  subtitle="Limite dos 25% menores resultados"
                >
                  <template #append>
                    <v-chip size="small">
                      {{ estatisticas?.q1 }}
                    </v-chip>
                  </template>
                </v-list-item>
              </v-col>

              <v-col cols="6">
                <v-list-item
                  title="Q3"
                  subtitle="Limite dos 75% dos resultados"
                >
                  <template #append>
                    <v-chip size="small">
                      {{ estatisticas?.q3 }}
                    </v-chip>
                  </template>
                </v-list-item>
              </v-col>

              <v-col cols="6">
                <v-list-item
                  title="IQR"
                  subtitle="Faixa central dos resultados"
                >
                  <template #append>
                    <v-chip size="small">
                      {{ estatisticas?.iqr }}
                    </v-chip>
                  </template>
                </v-list-item>
              </v-col>

              <v-col cols="6">
                <v-list-item
                  title="Outliers"
                  subtitle="Animais fora do padrão"
                >
                  <template #append>
                    <v-chip
                      size="small"
                      :color="outliers.length ? 'error' : 'success'"
                    >
                      {{ outliers.length }}
                    </v-chip>
                  </template>
                </v-list-item>
              </v-col>

              <v-col cols="6">
                <v-list-item
                  title="Menor valor esperado"
                  subtitle="Abaixo deste valor, pode haver outliers"
                >
                  <template #append>
                    <v-chip size="small">
                      {{ estatisticas?.limite_inferior }}
                    </v-chip>
                  </template>
                </v-list-item>
              </v-col>

              <v-col cols="6">
                <v-list-item
                  title="Maior valor esperado"
                  subtitle="Acima deste valor, pode haver outliers"
                >
                  <template #append>
                    <v-chip size="small">
                      {{ estatisticas?.limite_superior }}
                    </v-chip>
                  </template>
                </v-list-item>
              </v-col>
          </v-row>
          
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</v-container>

</template>