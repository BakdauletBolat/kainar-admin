import { defineStore } from "pinia";
import axiosInstance from "@/shared/api/axios";
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
        id: number;
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
    getters: {
        hasRole: (state) => (role: string) => {
            if (role === "all") return true;
            if (!state.user || !state.user.roles) return false;
            return state.user.roles.some(r => r.name === role);
        },
        hasAnyRole: (state) => (roles: string[]) => {
            console.log(roles, state.user, state.user?.roles);
            if (roles.includes("all")) return true;
            if (!state.user || !state.user.roles) return false;
            return state.user.roles.some(r => roles.includes(r.name));
        },
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
        },
        async updateProfile(data: any) {
            if (!this.user) return;
            this.isLoading = true;
            try {
                const res = await axiosInstance.patch(`/api/users/${this.user.id}/`, data);
                this.user = res.data;
                return res.data;
            } finally {
                this.isLoading = false;
            }
        },
    },
});
