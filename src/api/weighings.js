import api from '@/plugins/axios';

export default {
    getWeighingByLotId(loteId) {
        return api.get(`lote/${loteId}/pesagens`);
    },

    getWeighingByAnimalId(animalId) {
        return api.get(`${animalId}/pesagens`);
    },

    createWeighing(data) {
        return api.post(`${data.animal}/pesagens`, data);
    },

    updateWeighing(pesagem_id, data) {
        return api.put(`/pesagens/${pesagem_id}`, data);
    },
    
    deleteWeighing(pesagem_id) {
        return api.delete(`/pesagens/${pesagem_id}`);
    },

}