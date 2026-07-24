import api from '@/plugins/axios';

export default {
    getFarmsByProducerId(producerId) {
        return api.get(`${producerId}/fazendas`);
    },

    createFarm(producerId, data) {
        return api.post(`${producerId}/fazendas`, data);
    },

    updateFarm(producerId, farmId, data) {
        return api.put(`${producerId}/fazendas/${farmId}/`, data);
    },

    deleteFarm(producerId, farmId) {
        return api.delete(`${producerId}/fazendas/${farmId}/`);
    }
}