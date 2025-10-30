import { Component, ChangeDetectionStrategy, input, output, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgOptimizedImage],
})
export class CartComponent {
  isOpen = input.required<boolean>();
  close = output<void>();
  checkoutClicked = output<void>();

  cartService = inject(CartService);

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).id === 'cart-backdrop') {
      this.close.emit();
    }
  }

  updateQuantity(id: string, quantity: string): void {
    const numQuantity = parseInt(quantity, 10);
    if (!isNaN(numQuantity) && numQuantity >= 0) {
      this.cartService.updateQuantity(id, numQuantity);
    }
  }
}
