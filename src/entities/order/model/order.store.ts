import { defineStore } from 'pinia';
import {
  getOrders,
  getOrder,
  createOrder,
  confirmOrder,
  cancelOrder,
  confirmPaymentOrder,
  refundOrder,
} from '../api/order.api';
import type { Order, CreateOrderBody } from './types';

export const useOrderStore = defineStore('order', {
  state: () => {
    return {
      orders: [] as Order[],
      ordersInProgress: [] as Order[],
      order: null as Order | null,
      isLoadingOrders: false,
      isLoadingOrdersInProgress: false,
      isLoadingCreate: false,
      isLoadingRefundOrder: false,
      isLoadingConfirmPaymentOrder: false,
      isLoadingConfirmOrder: false,
      isLoadingCancelOrder: false,
    };
  },
  getters: {
    orderName(state) {
      return state.order?.goods.map((good) => good.product.name).join(', ');
    },
  },
  actions: {
    async loadOrders(options: object) {
      this.isLoadingOrders = true;
      return getOrders(options)
        .then((res) => {
          this.orders = res.data.results;
          return res.data;
        })
        .finally(() => {
          this.isLoadingOrders = false;
        });
    },
    async loadOrdersInProgress(options: object) {
      this.isLoadingOrdersInProgress = true;
      return getOrders(options)
        .then((res) => {
          this.ordersInProgress = res.data.results;
          return res.data;
        })
        .finally(() => {
          this.isLoadingOrdersInProgress = false;
        });
    },
    async loadOrder(pk: string) {
      this.isLoadingOrders = true;
      getOrder(pk)
        .then((res) => {
          this.order = res.data;
        })
        .finally(() => {
          this.isLoadingOrders = false;
        });
    },
    async refund(comment: string) {
      if (!this.order) return;
      this.isLoadingRefundOrder = true;
      const goods = this.order.goods.map((good) => {
        return {
          product_id: good.product.id,
          quantity: good.quantity,
          quality_id: 1,
        };
      });
      return refundOrder(this.order.id, this.order.warehouse.id, goods, comment)
        .then(() => {
          this.loadOrder(this.order!.id.toString());
        })
        .finally(() => {
          this.isLoadingRefundOrder = false;
        });
    },
    async confirmPayment() {
      if (!this.order) return;
      this.isLoadingConfirmPaymentOrder = true;
      return confirmPaymentOrder(this.order.id)
        .then(() => {
          this.loadOrder(this.order!.id.toString());
        })
        .finally(() => {
          this.isLoadingConfirmPaymentOrder = false;
        });
    },
    async confirm() {
      if (!this.order) return;
      this.isLoadingConfirmOrder = true;
      return confirmOrder(this.order.id)
        .then(() => {
          this.loadOrder(this.order!.id.toString());
        })
        .finally(() => {
          this.isLoadingConfirmOrder = false;
        });
    },
    async cancel() {
      if (!this.order) return;
      this.isLoadingCancelOrder = true;
      return cancelOrder(this.order.id)
        .then(() => {
          this.loadOrder(this.order!.id.toString());
        })
        .finally(() => {
          this.isLoadingCancelOrder = false;
        });
    },
    async create(body: CreateOrderBody) {
      this.isLoadingCreate = true;
      return createOrder(body)
        .then((res) => {
          return res.data;
        })
        .finally(() => {
          this.isLoadingCreate = false;
        });
    },
    // Aliases for compatibility
    async createOrder(body: CreateOrderBody) {
      return await this.create(body);
    },
    async refundOrder(comment: string) {
      return await this.refund(comment);
    },
    async confirmPaymentOrder() {
      return await this.confirmPayment();
    },
    async confirmOrder() {
      return await this.confirm();
    },
    async cancelOrder() {
      return await this.cancel();
    },
  },
});
