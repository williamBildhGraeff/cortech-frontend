import api from '@/plugins/axios'
export default {
    async getAnimals() {
        const lote_id = localStorage.getItem('lot')
        const response = await api.get(`/${lote_id}/animais`)
        return response.data
    },
    
    async getAnimalById(loteId, animalId) {
        const response = await api.get(`/${loteId}/animais/${animalId}`)
        return response.data
    },

    async createAnimal(loteId, animalData) {
        return await api.post(`/${loteId}/animais/`, animalData)
    },

    async updateAnimal(animalId, animalData) {
        return await api.put(`/animais/${animalId}/`, animalData)
    },

    async deleteAnimal(animalId) {
        return await api.delete(`/animais/${animalId}/`)
    }
}