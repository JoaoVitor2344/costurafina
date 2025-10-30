import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  wishlistItems = signal<Product[]>([]);

  totalItems = computed(() => this.wishlistItems().length);

  toggleWishlist(product: Product): void {
    this.wishlistItems.update(items => {
      const itemInWishlist = items.find(item => item.id === product.id);
      if (itemInWishlist) {
        return items.filter(item => item.id !== product.id);
      }
      return [...items, product];
    });
  }
  
  removeFromWishlist(productId: number): void {
     this.wishlistItems.update(items => items.filter(item => item.id !== productId));
  }

  isWishlisted = computed(() => {
    const ids = new Set(this.wishlistItems().map(p => p.id));
    return (productId: number) => ids.has(productId);
  });
}
