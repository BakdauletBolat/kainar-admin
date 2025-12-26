import { defineStore } from 'pinia';
import { Router } from 'vue-router';
import type { AuthUser, AuthPayload } from './types';
import { authUserApi, getUserMeApi, updateUserProfileApi } from '../api/user.api';

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      user: null as AuthUser | null,
      isLoading: false as boolean,
      isAuthenticated: localStorage.getItem('auth-token') !== null,
    };
  },
  getters: {
    hasRole: (state) => (role: string) => {
      if (role === 'all') return true;
      if (!state.user || !state.user.roles) return false;
      return state.user.roles.some((r) => r.name === role);
    },
    hasAnyRole: (state) => (roles: string[]) => {
      if (roles.includes('all')) return true;
      if (!state.user || !state.user.roles) return false;
      return state.user.roles.some((r) => roles.includes(r.name));
    },
  },
  actions: {
    async authUser(body: AuthPayload) {
      this.isLoading = true;
      return authUserApi(body)
        .then((res) => {
          localStorage.setItem('auth-token', res.data.access);
          this.isAuthenticated = true;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async userMe() {
      return getUserMeApi()
        .then((res) => {
          this.user = res.data;
        })
        .catch((err) => {
          console.error(err);
          localStorage.removeItem('auth-token');
          this.isAuthenticated = false;
        });
    },
    async logout(router?: Router) {
      localStorage.removeItem('auth-token');
      this.isAuthenticated = false;
      if (router != undefined) {
        await router.push({
          name: 'login',
        });
      }
    },
    async updateProfile(data: any) {
      if (!this.user) return;
      this.isLoading = true;
      try {
        const res = await updateUserProfileApi(this.user.id, data);
        this.user = res.data;
        return res.data;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
