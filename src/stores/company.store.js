import { defineStore } from "pinia";

export const useCompanyStore = defineStore('companies', {
    state: () => ({
        companies
    })
})