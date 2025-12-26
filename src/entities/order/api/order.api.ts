import axiosIns from '@/shared/api/axios';
import generateQuery from '@/shared/lib/generateQuery';
import type { Order, CreateOrderBody } from '../model/types';

export async function getOrders(options: object = {}) {
  const query = generateQuery(options);
  return await axiosIns.get<{
    results: Order[];
  }>(`/api/admin/orders/${query}`);
}

export async function getOrder(id: string) {
  return await axiosIns.get<Order>(`/api/admin/orders/${id}/`);
}

export async function createOrder(body: CreateOrderBody) {
  return await axiosIns.post<Order>('/api/admin/orders/', body);
}

export async function confirmOrder(id: number) {
  return await axiosIns.post(`/api/admin/orders/${id}/confirm/`);
}

export async function cancelOrder(id: number) {
  return await axiosIns.delete(`/api/admin/orders/${id}/`);
}

export async function confirmPaymentOrder(id: number) {
  return await axiosIns.patch(`/api/admin/orders/${id}/`, {
    payment_status: 2,
  });
}

export async function refundOrder(
  orderId: number,
  warehouseId: number,
  goods: any[],
  comment: string
) {
  const body = {
    comment: comment,
    warehouse_id: warehouseId,
    refund_order_id: orderId,
    goods: goods,
  };
  return await axiosIns.post('/api/admin/orders/refund/', body);
}
