
<script>
import {
	Chart,
	LineController,
	LineElement,
	PointElement,
	LinearScale,
	CategoryScale,
	Tooltip,
	Legend,
} from 'chart.js'
import weighings from '../../../api/weighings';

Chart.register(
	LineController,
	LineElement,
	PointElement,
	LinearScale,
	CategoryScale,
	Tooltip,
	Legend
)

export default {
	name: 'PesagemDialog',

	props: {
		modelValue: {
			type: Boolean,
			default: false,
		},

		animal: {
			type: Object,
			default: null,
		},

		novaPesagem: {
			type: Boolean,
			default: false,
		},
	},

	emits: [
		'update:modelValue',
		'save',
	],

	data() {
		return {
			chart: null,
			loading: false,
			pesagem: this.getInitialPesagem(),
            pesagens: [],
			dialogDelete: false,
			weightingToDelete: null,
			indicadores: {},
			origemItems: [
				{
					title: 'Manual',
					value: 'manual',
				},
				{
					title: 'Importação',
					value: 'importacao',
				},
			],
		}
	},

	computed: {
		dialog: {
			get() {
				return this.modelValue
			},

			set(value) {
				this.$emit(
					'update:modelValue',
					value
				)
			},
		},

		gmdPreview() {
			if (
				!this.pesagens[0] ||
				!this.pesagem.peso ||
				!this.pesagem.data
			) return ''
			const atual = new Date(`${this.pesagem.data}T00:00:00`)
			const anterior = new Date(`${this.pesagens[0].data}T00:00:00`)
			const dias = Math.floor((atual - anterior) / (1000 * 60 * 60 * 24))
			if (dias <= 0) return ''
			const ganho = Number(this.pesagem.peso) - Number(this.pesagens[0]?.peso)
			return (ganho / dias).toFixed(2)
		},
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

		afterEnter() {
			this.pesagem = this.getInitialPesagem()
            this.getWeighing()
		},

		afterLeave() {
			if (this.chart) {
				this.chart.destroy()
				this.chart = null
			}

			this.pesagem =
				this.getInitialPesagem()

			this.$refs.form?.resetValidation()
		},

		criarGrafico() {
            if (!this.$refs.pesoChart) {
                return
            }
            if (this.chart) {
                this.chart.destroy()
            }

            const dados = [...this.pesagens].sort(
                (a, b) =>
                    new Date(a.data) -
                    new Date(b.data)
            )

            if (!dados.length) {
                return
            }

            const pesos = dados.map(
                (item) => Number(item.peso)
            )

            const menorPeso = Math.min(...pesos)
            const maiorPeso = Math.max(...pesos)

            const margem =
                (maiorPeso - menorPeso) * 0.15 || 10

            this.chart = new Chart(
                this.$refs.pesoChart,
                {
                    type: 'line',

                    data: {
                        labels: dados.map(
                            (item) =>
                                this.formatDate(
                                    item.data
                                )
                        ),

                        datasets: [
                            {
                                label: 'Peso',

                                data: pesos,

                                borderWidth: 3,

                                borderColor: '#1976D2',

                                backgroundColor:
                                    'rgba(25, 118, 210, 0.10)',

                                fill: true,

                                tension: 0.35,

                                pointRadius: 5,

                                pointHoverRadius: 7,

                                pointBorderWidth: 2,

                                pointBackgroundColor:
                                    '#FFFFFF',

                                pointBorderColor:
                                    '#1976D2',
                            },
                        ],
                    },

                    options: {
                        responsive: true,

                        maintainAspectRatio: false,

                        interaction: {
                            intersect: false,

                            mode: 'index',
                        },

                        layout: {
                            padding: {
                                top: 20,
                                right: 15,
                                left: 5,
                                bottom: 5,
                            },
                        },

                        plugins: {
                            legend: {
                                display: false,
                            },

                            tooltip: {
                                backgroundColor:
                                    'rgba(33, 33, 33, 0.95)',

                                titleColor: '#FFFFFF',

                                bodyColor: '#FFFFFF',

                                padding: 12,

                                displayColors: false,

                                cornerRadius: 8,

                                callbacks: {
                                    title: (
                                        context
                                    ) =>
                                        `Pesagem • ${context[0].label}`,

                                    label: (
                                        context
                                    ) =>
                                        `${context.raw} kg`,
                                },
                            },
                        },

                        scales: {
                            y: {
                                min:
                                    Math.floor(
                                        menorPeso -
                                            margem
                                    ),

                                max:
                                    Math.ceil(
                                        maiorPeso +
                                            margem
                                    ),

                                border: {
                                    display: false,
                                },

                                grid: {
                                    color:
                                        'rgba(0, 0, 0, 0.06)',

                                    drawTicks: false,
                                },

                                ticks: {
                                    padding: 10,

                                    callback: (
                                        value
                                    ) =>
                                        `${value} kg`,
                                },
                            },

                            x: {
                                border: {
                                    display: false,
                                },

                                grid: {
                                    display: false,
                                },

                                ticks: {
                                    padding: 10,
                                },
                            },
                        },
                    },
                }
            )
        },

		async salvar() {
			const { valid } = await this.$refs.form.validate()
			if (!valid) return
			try {
				if(!this.pesagem?.id){

					const data = {
						animal: this.animal.id,
						...this.pesagem
					}
					await weighings.createWeighing(data)
					this.$toast.success('Sucesso ao inserir a pesagem!')
				} else {
					await weighings.updateWeighing(this.pesagem.id, this.pesagem)
					this.$toast.success('Sucesso ao atualizar a pesagem!')
				}
				this.pesagem = this.getInitialPesagem()
				this.getWeighing()
			} catch (error) {
				console.error(error)
				this.$toast.error(this.$errorApi(error))
			}
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

		formatDate(date) {
			if (!date) {
				return ''
			}

			const [
				year,
				month,
				day,
			] = date.split('-')

			return `${day}/${month}/${year}`
		},

        async getWeighing(){
            try {
                const response = await weighings.getWeighingByAnimalId(this.animal.id)
               this.pesagens = response.data.pesagens
			   this.indicadores = response.data.indicadores
               this.criarGrafico()
            } catch (error) {
                console.error(error)
                this.$toast.error(this.$errorApi(error))
            }
        },

		editWeighting(item){
			this.pesagem = {...item}
		},

		deleteWeighting(item){
			this.weightingToDelete = {...item}
			this.dialogDelete = true
		},

		getOrigemLabel(origem) {
			const item =
				this.origemItems.find(
					(item) =>
						item.value ===
						origem
				)

			return (
				item?.title ||
				origem
			)
		},
	},
}
</script>
<template>
	<v-dialog
		v-model="dialog"
		max-width="1100"
		@after-enter="afterEnter"
		@after-leave="afterLeave"
	>
		<v-card>
			<v-toolbar class="d-flex align-center" density="compact" color="primary">
                <v-toolbar-title>
                    <v-icon
					icon="mdi-scale-balance"
					class="me-3"
                    />
                    Pesagens do animal
                </v-toolbar-title>

				<v-toolbar-items>
                    <v-btn
					icon="mdi-close"
					variant="text"
					@click="dialog = false"
                    />
                </v-toolbar-items>
			</v-toolbar>

			<v-divider />

			<v-card-text>
				<!-- ANIMAL -->
				<v-row>
					<v-col cols="12">
						<v-card
							color="grey-lighten-4"
						>
							<v-row align="center">
								<v-col
								class="d-flex justify-center"
									cols="12"
									sm="6"
									md="3"
								>
									<v-list-item
										prepend-icon="mdi-cow"
										class="px-0"
										title="Animal"
										:subtitle="
											animal?.brinco || '-'
										"
									/>
								</v-col>

								<v-col
								class="d-flex justify-center"
									cols="12"
									sm="6"
									md="3"
								>
									<v-list-item
										prepend-icon="mdi-calendar"
										class="px-0"
										title="Última pesagem"
										:subtitle="
											formatDate(
												pesagens[0]?.data
											) || '-'
										"
									/>
								</v-col>

								<v-col
								class="d-flex justify-center"
									cols="12"
									sm="6"
									md="3"
								>
									<v-list-item
										prepend-icon="mdi-weight-kilogram"
										class="px-0"
										title="Peso atual"
										:subtitle="
											indicadores.ultima_pesagem
										? `${indicadores.ultima_pesagem} kg`
										: '-'
										"
									/>
								</v-col>

								<v-col
								class="d-flex justify-center"
									cols="12"
									sm="6"
									md="3"
								>
									<v-list-item
										prepend-icon="mdi-counter"
										class="px-0"
										title="Pesagens"
										:subtitle="
											String(
												pesagens.length
											)
										"
									/>
								</v-col>
							</v-row>
						</v-card>
					</v-col>
				</v-row>

				<!-- INDICADORES -->
				<v-row class="mt-1">
					<v-col
						cols="12"
						sm="6"
						md="3"
					>
						<v-card
							class="d-flex justify-center"
							color="secondary"
						>
							<v-list-item
								prepend-icon="mdi-weight"
								class="px-0"
								title="Peso inicial"
								:subtitle="
									indicadores.primeira_pesagem
										? `${indicadores.primeira_pesagem} kg`
										: '-'
								"
							/>
						</v-card>
					</v-col>

					<v-col
						cols="12"
						sm="6"
						md="3"
					>
						<v-card
							class="d-flex justify-center"
							color="success"
						>
							<v-list-item
								prepend-icon="mdi-trending-up"
								class="px-0"
								title="Ganho total"
								:subtitle="
									indicadores.ganho_total
										? `${indicadores.ganho_total} kg`
										: '-'
								"
							/>
						</v-card>
					</v-col>

					<v-col
						cols="12"
						sm="6"
						md="3"
					>
						<v-card
							class="d-flex justify-center"
							color="warning"
						>
							<v-list-item
								prepend-icon="mdi-speedometer"
								class="px-0"
								title="GMD atual"
								:subtitle="
									indicadores.gmd_atual
										? `${indicadores.gmd_atual} kg`
										: '-'
								"
							/>
						</v-card>
					</v-col>

					<v-col
						cols="12"
						sm="6"
						md="3"
					>
						<v-card
							class="d-flex justify-center"
							color="primary"
						>
							<v-list-item
								prepend-icon="mdi-chart-line"
								class="px-0"
								title="GMD médio"
								:subtitle="
									indicadores.gmd_medio
										? `${indicadores.gmd_medio} kg`
										: '-'
								"
							/>
						</v-card>
					</v-col>
				</v-row>

				<!-- GRÁFICO PESO -->
				<v-row class="mt-1" v-show="pesagens.length > 1">
					<v-col cols="12">
						<v-card
                            variant="elevated"
                        >
                            <v-card-title
                                class="d-flex align-center"
                            >
                                <v-icon
                                    icon="mdi-chart-line"
                                    class="me-2"
                                />

                                Evolução do peso

                                <v-spacer />

                                <v-chip
                                    size="small"
                                    color="primary"
                                    variant="tonal"
                                >
                                    {{ pesagens.length }} pesagens
                                </v-chip>
                            </v-card-title>

                            <v-divider />

                            <v-card-text>
                                <v-row>
                                    <v-col
                                        cols="12"
                                        style="height: 350px"
                                    >
                                        <canvas
                                            ref="pesoChart"
                                        />
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
					</v-col>
				</v-row>

				<!-- NOVA PESAGEM -->
				<v-row class="mt-1">
					<v-col cols="12">
						<v-card variant="elevated">
							<v-toolbar 
								density="compact"
								class="text-subtitle-1" 
								color="primary">
								<v-toolbar-title>

									<v-icon
									icon="mdi-weight-kilogram"
									class="me-2"
									/>
									{{ this.pesagem.id ?
									 "Editar Pesagem" : "Nova Pesagem" }}
								</v-toolbar-title>
							</v-toolbar>

							<v-divider />

							<v-card-text>
								<v-form ref="form">
									<v-row>
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
												density="comfortable"
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
												density="comfortable"
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
												density="comfortable"
											/>
										</v-col>

										<v-col
											cols="12"
											sm="3"
										>
											<v-text-field
												:model-value="
													gmdPreview
												"
												label="GMD estimado"
												suffix="kg/dia"
												variant="outlined"
												density="comfortable"
												readonly
												hint="Calculado com base na pesagem anterior"
												persistent-hint
											/>
										</v-col>

										<v-col
											cols="12"
											class="d-flex align-center justify-end"
										>
											
											<v-btn
												class="me-2"
												color="info"
												variant="tonal"
												:loading="loading"
												@click="this.pesagem = getInitialPesagem()"
												prepend-icon="mdi-plus"
												text="Nova pesagem"
											/>
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
					</v-col>
				</v-row>

				<!-- HISTÓRICO -->
				<v-row class="mt-1">
					<v-col cols="12">
						<v-card variant="elevated">
							<v-toolbar
								density="compact"
								class="text-subtitle-1"
								color="primary"
							>
							<v-toolbar-title>

								<v-icon
								icon="mdi-history"
								class="me-2"
								/>
								Histórico de pesagens
							</v-toolbar-title>
							</v-toolbar>

							<v-divider />

							<v-card-text class="pa-0">
								<v-table
									v-if="
										pesagens.length
									"
									density="comfortable"
								>
									<thead>
										<tr>
											<th>
												Data
											</th>

											<th>
												Peso
											</th>

											<th>
												GMD
											</th>

											<th>
												Classificação
											</th>

											<th>
												Origem
											</th>
											<th class="text-center">
												Ações
											</th>
										</tr>
									</thead>

									<tbody>
										<tr
											v-for="item in pesagens"
											:key="item.id"
										>
											<td>
												{{
													formatDate(
														item.data
													)
												}}
											</td>

											<td>
												<strong>
													{{
														item.peso
													}}
													kg
												</strong>
											</td>

											<td>
												{{
													item.gmd_calculado_automatico !==
													null
														? `${item.gmd_calculado_automatico} kg/dia`
														: '-'
												}}
											</td>

											<td>
												{{
													item.classificacao ||
													'-'
												}}
											</td>

											<td>
												<v-chip
													size="small"
													variant="tonal"
													:color="
														item.origem ===
														'manual'
															? 'primary'
															: 'secondary'
													"
												>
													{{
														getOrigemLabel(
															item.origem
														)
													}}
												</v-chip>
											</td>
											<td
												class="d-flex align-center justify-center">
												<v-btn
												v-tooltip="'Editar pesagem'"
												class="me-2"
												size="x-small"
												rounded=""
												color="primary"
												icon="mdi-pen"
												@click="editWeighting(item)"/>

												<v-btn
												v-tooltip="'Deletar pesagem'"
												size="x-small"
												rounded=""
												color="red"
												icon="mdi-delete"
												@click="deleteWeighting(item)"/>
											</td>
										</tr>
									</tbody>
								</v-table>

								<v-alert
									v-else
									type="info"
									variant="tonal"
									class="ma-4"
								>
									Este animal ainda não possui
									pesagens cadastradas.
								</v-alert>
							</v-card-text>
						</v-card>
					</v-col>
				</v-row>
			</v-card-text>
		</v-card>
	</v-dialog>
	
	<dialog-delete
		v-model="dialogDelete"
		title="Confirmar exclusão"
		message="Deseja realmente excluir este item?"
		confirm-text="Excluir"
		cancel-text="Cancelar"
		@confirm="deletarPesagem"
	/>
</template>
