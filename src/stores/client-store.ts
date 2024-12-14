import { defineStore } from "pinia";
import axiosInstance from "@/apis";
import generateQuery from "@/utils/generateQuery.ts";

export interface Client {
    city: undefined;
    date_joined: Date;
    email: string | undefined;
    first_name: string | undefined;
    id: number;
    last_name: string | undefined;
    middle_name: string | undefined;
    phone: string | undefined;
    profile_type: number;
}

export const useClientStore = defineStore("client-store", {
    state: () => {
        return {
            clients: [] as Client[],
            clientsCount: 0,
            isLoadingClients: false
        };
    },
    actions: {
        async loadClients(options: Object) {
            this.isLoadingClients = true;
            const query = generateQuery(options);
            return axiosInstance
                .get(`/api/admin/users/${query}`)
                .then((res) => {
                    this.clients = res.data.results;
                    this.clientsCount = res.data.count;
                    return res.data.results;
                }).finally(() => {
                    this.isLoadingClients = false;
                });
        }
    },
});
