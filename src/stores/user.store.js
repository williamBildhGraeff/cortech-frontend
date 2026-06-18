import { defineStore } from "pinia"
export const useUserStore = defineStore('user', {
    state: ()=>({
        user: null,
        empresa_id: null
    }),

    getters: {
        getUser(state){
            return state.user
        },

        getEmpresaId(state){
            return state.getEmpresaId
        }
    },

    actions: {
        setEmpresaId(id){
            this.empresa_id = id
        },
        
        defineUser(user){
            this.user = user
            localStorage.setItem('token', user.access)
        }
    }
})