import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import vuetify from './plugins/vuetify.js'

createApp(App)
  .use(vuetify)
  .use(router)
  .mount('#app')