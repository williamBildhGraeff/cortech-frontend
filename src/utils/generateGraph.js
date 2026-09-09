export default function graficoPesagensAnimal(pesagens) {
            if (!this.$refs.pesoChart) {
                return
            }

            if (this.chart) {
                this.chart.destroy()
            }

            const dados = [...pesagens].sort(
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