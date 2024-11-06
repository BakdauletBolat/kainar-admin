import { defineStore } from "pinia";
import axiosInstance from "@/apis";

interface AuthPayload {
    phone: string;
    password: string;
}


interface AuthUser {
    id: number;
    phone: string;
    email: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    profile_type: string;
}

export const useAuthStore = defineStore("auth-store", {
    state: () => {
        return {
            user: null as AuthUser | null
        };
    },
    getters: {
        isAuthenticated: () => {
            return localStorage.getItem("auth-token") !== null;
        }
    },
    actions: {
        async authUser(body: AuthPayload) {
            return axiosInstance
                .post(`/api/users/token`, body)
                .then((res) => {
                    localStorage.setItem("auth-token", res.data.token);
                });
        },
        async userMe() {
            return axiosInstance
                .get(`/api/users/me`)
                .then((res) => {
                    this.user = res.data;
                }).catch((err) => {
                    console.error(err);
                    localStorage.removeItem("auth-token");
                });
        }
    },
});
