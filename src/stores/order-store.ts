import {defineStore} from "pinia";
import {getOrders, type Product} from "@/apis/orders.ts";

export const useOrderStore = defineStore("order-store", {
    state: () => {
        return {
            orders: [] as Product[],
            isLoadingOrders: false,
        }
    },
    actions: {
        async loadOrders(options: object) {
            this.isLoadingOrders = true;
            getOrders(options).then(res=>{
                this.orders = res.data.results;
            }).finally(()=>{
                this.isLoadingOrders = false;
            })
        }
    }
})