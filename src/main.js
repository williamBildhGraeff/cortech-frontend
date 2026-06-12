import { createApp } from 'vue'
import App from '@/App.vue'
import router from './router/index.js'
import vuetify from './plugins/vuetify.js'
import { registerPlugins } from './plugins/index.js'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')