/**
 * router/index.js
 *
 * Automatic routes for `./src/pages/*.vue`
 */

import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/pages/Login.vue'
import ListProducers from '../views/pages/ListProducers.vue'
import ListFarms from '../views/pages/ListFarms.vue'
import ListLots from '../views/pages/ListLots.vue'
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
   {
    path: '/produtores',
    name: 'Produtores',
    component: ListProducers,
  },
  {
    path: '/fazendas/:id',
    name: 'Fazendas',
    component: ListFarms,
  },
  {
    path: '/:producer_id/fazendas/:farm_id/lotes',
    name: 'Lotes',
    component: ListLots,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
