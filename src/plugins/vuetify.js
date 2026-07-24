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
 theme: {
  defaultTheme: 'dark',
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
        background: '#F8FAFC',
        surface: '#FFFFFF',
        'surface-variant': '#F1F5F9',
        'on-primary': '#FFFFFF',
        'on-secondary': '#FFFFFF',
        'on-background': '#0F172A',
        'on-surface': '#1E293B',
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
