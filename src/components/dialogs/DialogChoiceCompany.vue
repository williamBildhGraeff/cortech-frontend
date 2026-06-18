
<script>
import { mapActions } from 'pinia';
import { useUserStore } from '../../stores/user.store';

export default {
    props: {
        modelValue: {
            type: Boolean,
            default: false
        }, 
        companies: {
            type: Array,
            default: () => []
        }
    },

    emits: ['update:modelValue'],

    data: () => ({
        selectedCompanies: null,
    }),

    computed: {
        dialog: {
            get(){
                return this.modelValue
            },

            set(value){
                this.$emit('update:modelValue', value)
            }
        }
    },

    methods: {
        ...mapActions(useUserStore, ['setEmpresaId']),
        confirmar () {
          this.setEmpresaId(this.selectedCompanies)
          this.$router.push('/produtores')
          this.dialog = false
        },
    },
}
</script>
<template>
  <v-dialog
    v-model="dialog"
    max-width="800"
  >
    <v-card rounded="xl">
      <v-toolbar
        color="primary"
        density="comfortable"
      >
        <v-toolbar-title>
          Selecionar empresa
        </v-toolbar-title>

        <v-spacer />

        <v-btn
          icon="mdi-close"
          variant="text"
          @click="dialog = false"
        />
      </v-toolbar>

      <v-card-text class="pa-6">

        <v-list
          class="mt-4 border rounded-lg"
          lines="two"
          max-height="450"
          style="overflow-y: auto"
        >
          <v-list-item
            v-for="company in companies"
            :key="company.id"
            :active="selectedCompanies?.id === company.id"
            rounded="lg"
            class="ma-2"
            @click="selectedCompanies = company"
          >
            <template #prepend>
              <v-avatar
                color="primary"
                size="42"
              >
                {{ company.nome.charAt(0) }}
              </v-avatar>
            </template>

            <v-list-item-title class="font-weight-bold">
              {{ company.nome }}
            </v-list-item-title>

            <v-list-item-subtitle>
              {{ company.cnpj }}
            </v-list-item-subtitle>

            <template #append>
              <v-icon
                v-if="selectedCompanies?.id === company.id"
                color="success"
              >
                mdi-check-circle
              </v-icon>
            </template>
          </v-list-item>

          <v-empty-state
            v-if="!companies.length"
            icon="mdi-domain-off"
            title="Nenhuma empresa encontrada"
            text="Tente alterar os filtros de busca."
          />
        </v-list>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <span
          v-if="selectedCompanies"
          class="text-caption text-medium-emphasis"
        >
          Empresa selecionada:
          <strong>{{ selectedCompanies.nome }}</strong>
        </span>

        <v-spacer />

        <v-btn
          variant="text"
          @click="dialog = false"
        >
          Cancelar
        </v-btn>

        <v-btn
          color="primary"
          :disabled="!selectedCompanies"
          @click="confirmar"
        >
          Selecionar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
