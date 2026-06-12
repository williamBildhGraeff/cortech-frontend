import api from '@/plugins/axios'
export default {
    async login(credentials) {
        const response = await api.post('/login/', credentials)
        return response.data
    }
}