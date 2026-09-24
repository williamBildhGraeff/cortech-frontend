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
import ListAnimals from '../views/pages/ListAnimals.vue'
import Core from '../components/core/Core.vue'
import ListWeighing from '../views/pages/ListWeighing.vue'
import Dashboard from '../views/pages/Dashboard.vue'
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
    path: '/fazendas',
    name: 'Fazendas',
    component: ListFarms,
  },
  {
    path: '/lotes',
    name: 'Lotes',
    component: ListLots,
  },
   {
    path: '/',
    name: 'Rebanho',
    redirect: '/animais',
    component: Core,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
      },
      {
        path: 'animais',
        name: 'Animais do Lote',
        component: ListAnimals,
      },
      {
        path: 'pesagens',
        name: 'Pesagens do Lote',
        component: ListWeighing,
      }
    ]
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
