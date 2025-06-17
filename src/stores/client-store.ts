import { defineStore } from "pinia";
import axiosInstance from "@/apis";
import generateQuery from "@/utils/generateQuery.ts";
import {useAuthStore} from "@/stores/auth-store.ts";
import {useRouter} from "vue-router";

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
        async loadClients(options: any) {
            options.sort = '-id'
            console.log("Loading clients with options:", options);
            this.isLoadingClients = true;
            const query = generateQuery(options);
            return axiosInstance
                .get(`/api/admin/users/${query}`)
                .then((res) => {
                    this.clients = res.data.results;
                    this.clientsCount = res.data.count;
                    return res.data.results;
                })
                .catch(e=>{
                    if (e.response.status === 401) {
                        const authStore = useAuthStore();
                        const router = useRouter();
                        authStore.logout(router);
                    }
                })
                .finally(() => {
                    this.isLoadingClients = false;
                });
        },
        async loadClient(id: number | string) {
            try {
                const res = await axiosInstance.get(`/api/users/${id}/`)
                return res.data
            } catch (e) {
                return null
            }
        },
        async patchClient(id: number | string, data: any) {
            try {
                const res = await axiosInstance.patch(`/api/users/${id}/`, data);
                return res.data;
            } catch (e) {
                throw e;
            }
        }
    },
});
