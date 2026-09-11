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

    exportWeighing(params) {
        return api.get(`/exportar-pesagens/`, {params, responseType: 'blob'});
    },

    importWeighing(file) {
        const lote_id = localStorage.getItem('lot');
        return api.post(`lotes/${lote_id}/importar-pesagens`, file,
            { headers: 
                {
                    'Content-Type': 'multipart/form-data',
                }
            },
        );
    },

}