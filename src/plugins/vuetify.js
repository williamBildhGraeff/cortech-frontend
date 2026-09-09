/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from 'vuetify'
// Styles
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  defaults: {
    VTextField: {
      variant: 'outlined',
      hideDetails: 'auto',
      density: 'compact'
    },
    VDateInput: {
      variant: 'outlined',
      hideDetails: 'auto',
      density: 'compact',
      prependIcon: '',
    },
    VNumberInput: {
      variant: 'outlined',
      hideDetails: 'auto',
      density: 'compact'
    },
    VSelect: {
      variant: 'outlined',
      hideDetails: 'auto',
      density: 'compact'
    },
    VSwitch: {
      variant: 'outlined',
      hideDetails: 'auto',
      density: 'compact'
    },
    VCol:{
      class: 'pa-1'
    },
    VRow: {
      noGutters: true
    }

  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
      colors: {
        primary: '#2563EB',
        secondary: '#60A5FA',
        info: '#0EA5E9',
        success: '#16A34A',
        warning: '#D97706',
        error: '#DC2626',
      },
    },  

    dark: {
      dark: true,
      colors: {
        primary: '#3B82F6',
        secondary: '#60A5FA',
        info: '#38BDF8',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        surface: '#1F2937',
        'surface-variant': '#374151',
        'on-primary': '#FFFFFF',
        'on-secondary': '#FFFFFF',
        'on-background': '#F9FAFB',
        'on-surface': '#F9FAFB',
      },
    },
  },
},

})
