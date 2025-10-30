import { CartItem } from './cart.model';

export type OrderStatus = 'Processando' | 'Enviado' | 'Em Trânsito' | 'Saiu para Entrega' | 'Entregue' | 'Cancelado';

export interface StatusHistoryItem {
  status: OrderStatus;
  date: Date;
}

export interface Order {
  id: string;
  userId: string;
  date: Date;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  statusHistory: StatusHistoryItem[];
}