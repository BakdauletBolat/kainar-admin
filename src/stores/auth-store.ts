import { defineStore } from "pinia";
import axiosInstance from "@/apis";
import {Router} from "vue-router";

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
    city: {
        name: string
    }
    uuid: string;
    date_joined: string;
    roles: {
        name: string;
    }[]
    is_active: boolean;
    is_staff: boolean;
    is_superuser: boolean;
    last_login: string;
}

export const useAuthStore = defineStore("auth-store", {
    state: () => {
        return {
            user: null as AuthUser | null,
            isLoading: false as boolean,
            isAuthenticated: localStorage.getItem("auth-token") !== null,
        };
    },
    actions: {
        async authUser(body: AuthPayload) {
            this.isLoading = true;
            return axiosInstance
                .post(`/api/admin/users/token/?is_admin_user=true`, body)
                .then((res) => {
                    localStorage.setItem("auth-token", res.data.access);
                    this.isAuthenticated = true;
                }).finally(()=>{
                    this.isLoading = false
                });
        },
        async userMe() {
            return axiosInstance
                .get(`/api/admin/users/me/`)
                .then((res) => {
                    this.user = res.data;
                }).catch((err) => {
                    console.error(err);
                    localStorage.removeItem("auth-token");
                    this.isAuthenticated = false;
                });
        },
        async logout(router?: Router) {
            localStorage.removeItem("auth-token");
            this.isAuthenticated = false;
            if (router != undefined) {
                await router.push({
                    name: "login"
                })
            }
        }
    },
});
