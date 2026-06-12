
import router from '@/router/index.js'
import vuetify from './vuetify'
import globalProperties from './globalProperties'

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(router)
    .use(globalProperties)
}
