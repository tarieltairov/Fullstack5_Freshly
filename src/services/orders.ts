import type { CreateOrderBody, Order } from '../types/order';
import { api } from './httpClient';

export async function createOrderRequest(data: CreateOrderBody) {
  const response = await api.post<Order>('/orders', data);
  return response.data;
}
