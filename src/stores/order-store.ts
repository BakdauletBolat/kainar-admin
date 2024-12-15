import {defineStore} from "pinia";
import {getOrders} from "@/apis/orders.ts";
import {Order} from '@/apis/domain';
import axiosIns from "@/apis";
import {useAuthStore} from "@/stores/auth-store.ts";
import {useRouter} from "vue-router";


interface Goods {
    product_id: number;
    quality_id: number;
    quantity: number;
}


interface CreateBodyInterface {
    goods: Goods[];
    delivery_type_id: number;
    payment_type_id: number;
    warehouse_id: number;
    comment: string;
    discount: number;
    first_name: string;
    phone_number: string;
    email: string;
}


export const useOrderStore = defineStore("order-store", {
    state: () => {
        return {
            orders: [] as Order[],
            order: null as Order | null,
            isLoadingOrders: false,
            isLoadingCreate: false
        }
    },
    getters: {
        orderName(state) {
            return state.order?.goods.map((good)=>good.product.name).join(", ");
        }
    },
    actions: {
        async loadOrders(options: object) {
            this.isLoadingOrders = true;
            return getOrders(options).then(res => {
                //@ts-ignore
                this.orders = res.data.results;
                return res.data;
            })
                .catch(e=>{
                    if (e.response.status === 401) {
                        const authStore = useAuthStore();
                        const router = useRouter();
                        authStore.logout(router);
                    }
                })
                .finally(() => {
                this.isLoadingOrders = false;
            })
        },
        async loadOrder(pk: string) {
            this.isLoadingOrders = true;
            axiosIns.get(`/api/admin/orders/${pk}/`).then(res=>{
                this.order = res.data;
            })
                .catch(e=>{
                    if (e.response.status === 401) {
                        const authStore = useAuthStore();
                        const router = useRouter();
                        authStore.logout(router);
                    }
                })
                .finally(()=>{
                this.isLoadingOrders = false;
            })
        },
        async createOrder(body: CreateBodyInterface) {
            this.isLoadingCreate = true;
            return axiosIns.post('/api/admin/orders/', body).then((res) => {
                return res.data;
            })
                .catch(e => {
                    if (e.response.status === 401) {
                        const authStore = useAuthStore();
                        const router = useRouter();
                        authStore.logout(router);
                    }
                })
        }
    }
})