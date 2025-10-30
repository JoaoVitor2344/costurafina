// Implemented OrderService to replace placeholder content.
import { Injectable, signal, inject, computed } from '@angular/core';
import { Order, OrderStatus } from '../models/order.model';
import { CartItem } from '../models/cart.model';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private authService = inject(AuthService);
  
  // Private signal to hold all orders. In a real app, this would be fetched from a backend.
  private allOrders = signal<Order[]>([]);

  // Public computed signal to expose only the orders for the logged-in user.
  userOrders = computed(() => {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      return [];
    }
    return this.allOrders().filter(order => order.userId === currentUser.id);
  });

  placeOrder(items: CartItem[], totalAmount: number): Order | null {
    const currentUser = this.authService.currentUser();
    if (!currentUser || items.length === 0) {
      return null;
    }

    const now = new Date();
    const newOrder: Order = {
      id: `order-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      userId: currentUser.id,
      date: now,
      items: items,
      totalAmount: totalAmount,
      status: 'Processando',
      statusHistory: [{ status: 'Processando', date: now }],
    };

    this.allOrders.update(orders => [...orders, newOrder]);
    
    // Simulate order processing for demo purposes
    this.simulateOrderStatusUpdates(newOrder.id);
    
    return newOrder;
  }

  /**
   * Checks if the current user has purchased a specific product and if the order has been delivered.
   * This fixes the error in product-modal.component.ts.
   */
  hasPurchasedAndReceived(productId: number): boolean {
    const orders = this.userOrders();
    return orders.some(order => 
      order.status === 'Entregue' && 
      // FIX: Correctly compare against item.productId instead of the composite item.id string.
      order.items.some(item => item.productId === productId)
    );
  }
  
  private simulateOrderStatusUpdates(orderId: string): void {
    const statuses: OrderStatus[] = ['Enviado', 'Em Trânsito', 'Saiu para Entrega', 'Entregue'];
    let delay = 10000; // 10 seconds for first update
    let statusIndex = 0;

    const updateStatus = () => {
      if (statusIndex >= statuses.length) return;

      this.allOrders.update(orders => {
        const orderIndex = orders.findIndex(o => o.id === orderId);
        if (orderIndex === -1) return orders;

        const updatedOrder = { ...orders[orderIndex] };
        const newStatus = statuses[statusIndex];
        updatedOrder.status = newStatus;
        updatedOrder.statusHistory = [...updatedOrder.statusHistory, { status: newStatus, date: new Date() }];

        const newOrders = [...orders];
        newOrders[orderIndex] = updatedOrder;
        return newOrders;
      });

      statusIndex++;
      delay = Math.random() * 20000 + 10000; // Random delay between 10-30 seconds for next update
      setTimeout(updateStatus, delay);
    };

    setTimeout(updateStatus, delay);
  }
}