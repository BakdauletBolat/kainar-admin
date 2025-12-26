import { defineStore } from 'pinia';
import { getClients, getClient, patchClient } from '../api/client.api';
import type { Client } from './types';

export const useClientStore = defineStore('client', {
  state: () => {
    return {
      clients: [] as Client[],
      clientsCount: 0,
      isLoadingClients: false,
    };
  },
  actions: {
    async loadClients(options: any) {
      this.isLoadingClients = true;
      return getClients(options)
        .then((res) => {
          this.clients = res.data.results;
          this.clientsCount = res.data.count;
          return res.data.results;
        })
        .finally(() => {
          this.isLoadingClients = false;
        });
    },
    async loadClient(id: number | string) {
      try {
        const res = await getClient(id);
        return res.data;
      } catch (e) {
        return null;
      }
    },
    async updateClient(id: number | string, data: any) {
      return await patchClient(id, data);
    },
    // Alias for compatibility
    async patchClient(id: number | string, data: any) {
      return await this.updateClient(id, data);
    },
  },
});
