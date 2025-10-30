import { Component, ChangeDetectionStrategy, input, output, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus } from '../../models/order.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgOptimizedImage],
})
export class OrderHistoryComponent {
  isOpen = input.required<boolean>();
  close = output<void>();
  reviewProductClicked = output<number>();

  orderService = inject(OrderService);
  productService = inject(ProductService);

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).id === 'order-history-backdrop') {
      this.close.emit();
    }
  }
  
  onReviewProduct(productId: number): void {
    this.reviewProductClicked.emit(productId);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getStatusProgress(status: OrderStatus): string {
    const statusMap: Record<OrderStatus, number> = {
      'Processando': 20,
      'Enviado': 40,
      'Em Trânsito': 60,
      'Saiu para Entrega': 80,
      'Entregue': 100,
      'Cancelado': 100,
    };
    return `${statusMap[status] || 0}%`;
  }
}