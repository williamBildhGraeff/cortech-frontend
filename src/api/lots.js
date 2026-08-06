import api from '@/plugins/axios'
export default {
    async getLots(farm_id){
        const response = await api.get(`${farm_id}/lotes`)
        return response.data
    },

    async createLot(farm_id, lot){
        const response = await api.post(`${farm_id}/lotes/`, lot)
        return response.data
    },

    async updateLot(farm_id, lot){
        const response = await api.put(`${farm_id}/lotes/${lot.id}/`, lot)
        return response.data
    },

    async deleteLot(farm_id, lot_id){
        const response = await api.delete(`${farm_id}/lotes/${lot_id}`)
        return response.data
    }
}