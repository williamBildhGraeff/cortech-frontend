<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script>
import { mapActions } from 'pinia';
import { useUserStore } from './stores/user.store';

  export default {
    name: 'App',
    methods: {
      ...mapActions(useUserStore, ['setEmpresaId']),
    },

    mounted() {
      const empresa = localStorage.getItem('empresa')
      if(empresa){
        this.setEmpresaId(JSON.parse(empresa).id)
      }
    }
  }
</script>
