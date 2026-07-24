import axios from 'axios'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
)

api.interceptors.response.use(
  response => response,
  error => {
    if(error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
    }
    api.interceptors.request.use(config => {
      const token = localStorage.getItem('token')
      if (
        token &&
        config.url !== '/login' &&
        config.url !== '/login/'
      ) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    })

    return Promise.reject(error)
  },
)

export default api
