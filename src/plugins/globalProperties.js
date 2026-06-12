import { createApp } from 'vue'
import Toast from '@/components/toasts/Toasts.vue'
import vuetify from './vuetify'
import apiError from '../utils/validate'
import validate from '../utils/validate'

export default {
  install (app) {
    // Cria uma instância isolada do componente Toast
    const toastApp = createApp(Toast)
    toastApp.use(vuetify)
    const container = document.createElement('div')
    document.body.append(container)
    const instance = toastApp.mount(container)

    // Define funções globais
    app.config.globalProperties.$toast = {
      success (msg = 'Sucesso') {
        instance.show(msg, 'success')
      },
      error (msg = 'Erro') {
        instance.show(msg, 'error')
      },
      warning (msg = 'Cuidado!') {
        instance.show(msg, 'warning')
      },
      info (msg) {
        instance.show(msg, 'info')
      }
    }

    app.config.globalProperties.$validate = validate

    app.config.globalProperties.$errorApi = (error) => {
        const mensagem =
            error.response?.data?.detail ||
            'Ocorreu um erro ao processar a solicitação'
        return mensagem
    }
  },
}
