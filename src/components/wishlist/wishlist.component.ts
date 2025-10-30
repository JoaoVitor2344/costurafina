import { Component, ChangeDetectionStrategy, input, output, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgOptimizedImage],
})
export class WishlistComponent {
  isOpen = input.required<boolean>();
  close = output<void>();

  wishlistService = inject(WishlistService);
  cartService = inject(CartService);

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).id === 'wishlist-backdrop') {
      this.close.emit();
    }
  }

  moveToCart(product: Product): void {
    // FIX: The addToCart method requires a Product and a ProductVariant.
    // A product from the wishlist doesn't have a variant pre-selected.
    // For this reason, we add the first variant to the cart by default.
    if (product.variants && product.variants.length > 0) {
      this.cartService.addToCart(product, product.variants[0]);
      this.wishlistService.removeFromWishlist(product.id);
    }
  }
}
