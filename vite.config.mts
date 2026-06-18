import { fileURLToPath, URL } from 'node:url'

import Vue from '@vitejs/plugin-vue'
import Fonts from 'unplugin-fonts/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VuetifyResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig } from 'vite'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineConfig({
  plugins: [
    Vue({
      template: { transformAssetUrls },
    }),

    AutoImport({
      imports: [
        'vue',
        'vue-router',
      ],
      dts: true,
    }),

    Components({
      resolvers: [
        VuetifyResolver(),
      ],
      dts: true,
    }),

    Vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),

    Fonts({
      fontsource: {
        families: [
          {
            name: 'Roboto',
            weights: [100, 300, 400, 500, 700, 900],
            styles: ['normal', 'italic'],
          },
        ],
      },
    }),
  ],

  define: {
    'process.env': {},
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.vue',
    ],
  },

  server: {
    port: 3000,
  },
})