import {defineStore} from "pinia";
import {getOrders} from "@/apis/orders.ts";
import axiosIns from "@/apis";


interface Goods {
    product_id: number;
    quality_id: number;
    quantity: number;
}

interface Product {
    category: Category;
    modification: Modification;
    detail: Detail;
    status: string;
    name: string;
    market_price: number;
    properties: string;
    defect: string;
    comment: string;
    mileage: number;
    mileageType: number;
}

interface Category {
    name: string;
    recar_category_id: number;
    parent: number;
}

interface Modification {
    axleConfiguration: string;
    driveType: string;
    gearType: string;
    fuelType: string;
    bodyType: string;
    modelCar: ModelCar;
    name: string;
    capacity: number;
    power: number;
    numberOfCycle: number;
    numberOfValves: number;
    vinCode: number;
    engineDisplacement: number;
    steeringType: number;
}

interface ModelCar {
    name: string;
    startDate: string; // Use Date type if you need to handle dates
    endDate: string;   // Use Date type if you need to handle dates
    manufacturer: number;
}

interface Detail {
    height: number;
    width: number;
    length: number;
    weight: number;
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
            orders: [] as Product[],
            isLoadingOrders: false,
            isLoadingCreate: false
        }
    },
    actions: {
        async loadOrders(options: object) {
            this.isLoadingOrders = true;
            getOrders(options).then(res => {
                //@ts-ignore
                this.orders = res.data.results;
            }).finally(() => {
                this.isLoadingOrders = false;
            })
        },
        async createOrder(body: CreateBodyInterface) {
            this.isLoadingCreate = true;
            axiosIns.post('/api/orders/', body).then((res) => {
                console.log(res.data)
            })
                .catch(e => {
                    console.log(e)
                })
        }
    }
})