<script>
export default {
  data: () => ({
    search: '',

    produtores: [
      {
        id: 1,
        nome: 'João da Silva',
        propriedade: 'Fazenda Santa Helena',
        municipio: 'Encantado/RS',
        rebanho: 320,
      },
      {
        id: 2,
        nome: 'Carlos Oliveira',
        propriedade: 'Estância Boa Vista',
        municipio: 'Roca Sales/RS',
        rebanho: 185,
      },
      {
        id: 3,
        nome: 'Pedro Martins',
        propriedade: 'Fazenda São José',
        municipio: 'Muçum/RS',
        rebanho: 540,
      },
      {
        id: 4,
        nome: 'Ricardo Ferreira',
        propriedade: 'Fazenda Horizonte',
        municipio: 'Lajeado/RS',
        rebanho: 260,
      },
      {
        id: 5,
        nome: 'André Lopes',
        propriedade: 'Sítio Bela Vista',
        municipio: 'Arroio do Meio/RS',
        rebanho: 90,
      },
    ],
  }),

  computed: {
    produtoresFiltrados () {
      const termo = this.search.toLowerCase()

      return this.produtores.filter(produtor =>
        produtor.nome.toLowerCase().includes(termo) ||
        produtor.propriedade.toLowerCase().includes(termo) ||
        produtor.municipio.toLowerCase().includes(termo)
      )
    },
  },
}
</script>
<template>
  <v-container class="py-8">
    <div class="text-h4 font-weight-bold mb-2">
      Qual produtor deseja atender?
    </div>

    <div class="text-subtitle-1 text-medium-emphasis mb-6">
      Selecione um produtor para acessar suas informações.
    </div>

    <v-text-field
      v-model="search"
      prepend-inner-icon="mdi-magnify"
      label="Buscar produtor"
      variant="outlined"
      hide-details
      class="mb-6"
    />

    <v-row>
      <v-col
        v-for="produtor in produtoresFiltrados"
        :key="produtor.id"
        cols="12"
        md="6"
        lg="4"
      >
       <v-card
        hover
        rounded="xl"
        @click="selecionarProdutor(produtor)"
        >
        <v-card-text>
            <div class="d-flex align-center">
            <v-avatar
                color="primary"
                size="56"
            >
                <v-icon>
                mdi-cow
                </v-icon>
            </v-avatar>

            <div class="ml-4">
                <div class="text-h6">
                {{ produtor.nome }}
                </div>

                <div class="text-body-2 text-medium-emphasis">
                {{ produtor.propriedade }}
                </div>
            </div>
            </div>

            <v-divider class="my-4" />

            <div class="d-flex justify-space-between mb-2">
            <span>Município</span>
            <strong>{{ produtor.municipio }}</strong>
            </div>

            <div class="d-flex justify-space-between">
            <span>Rebanho</span>
            <v-chip color="primary">
                {{ produtor.rebanho }} cabeças
            </v-chip>
            </div>
        </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>