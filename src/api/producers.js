import api from '@/plugins/axios'
import { useUserStore } from '@/stores/user.store'
export default {
    async getProducers(){
        const response = await api.get(`${useUserStore().empresa_id}/produtor/`)
        return response.data
    },

    async getProducerById(id){
        const response = await api.get(`/${useUserStore().empresa_id}/produtor/${id}/`)
        return response.data
    },

    async createProducer(data){
        const response = await api.post(`/${useUserStore().empresa_id}/produtor/`, data)
        return response.data
    },
    async updateProducer(id, data){
        const response = await api.put(`/${useUserStore().empresa_id}/produtor/${id}/`, data)
        return response.data
    },
    async deleteProducer(id){
        const response = await api.delete(`/${useUserStore().empresa_id}/produtor/${id}/`)
        return response.data
    }
}