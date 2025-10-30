import { Component, ChangeDetectionStrategy, input, output, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Product } from '../../models/product.model';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgOptimizedImage],
})
export class ProductCardComponent {
  product = input.required<Product>();
  productClicked = output<Product>();
  
  wishlistService = inject(WishlistService);

  toggleWishlist(event: MouseEvent): void {
    event.stopPropagation(); // Prevent the card click from opening the modal
    this.wishlistService.toggleWishlist(this.product());
  }

  onSelectOptions(event: MouseEvent): void {
    event.stopPropagation();
    this.productClicked.emit(this.product());
  }
}
