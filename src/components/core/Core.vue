<script>
import menu from '../../utils/menu';

export default {
    data: () => ({
        menu,
        drawer: false,
        path: '',
    })
}
</script>
<template>
    <v-layout>
        <v-app-bar color="primary" density="compact">
            <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>{{ $route.name }}</v-toolbar-title>

        <template v-if="$vuetify.display.mdAndUp">
          <v-btn icon="mdi-magnify" variant="text"></v-btn>

          <v-btn icon="mdi-filter" variant="text"></v-btn>
        </template>

        <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        :location="$vuetify.display.mobile ? 'bottom' : undefined"
        temporary
      >
        <v-list
            v-model="path"
            v-for="item in menu"
            density="compact"
            class="pa-0"
        >
            <v-list-item 
            :prepend-icon="item.icon"
            :to="item.path"
            :value="item.path"
            color="primary">
              {{ item.name }}
            </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <router-view/>
      </v-main>
    </v-layout>
</template>