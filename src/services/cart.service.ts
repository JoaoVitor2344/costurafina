import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/cart.model';
import { Product, ProductVariant } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[]>([]);

  subtotal = computed(() => {
    return this.cartItems().reduce((acc, item) => acc + item.price * item.quantity, 0);
  });

  totalItems = computed(() => {
    return this.cartItems().reduce((acc, item) => acc + item.quantity, 0);
  });

  addToCart(product: Product, variant: ProductVariant): void {
    this.cartItems.update(items => {
      const cartItemId = `${product.id}-${variant.sku}`;
      const itemInCart = items.find(item => item.id === cartItemId);
      if (itemInCart) {
        return items.map(item =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      
      const newItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        name: product.name,
        image: variant.image,
        price: variant.price,
        variant: variant,
        quantity: 1,
        category: product.category
      };

      return [...items, newItem];
    });
  }

  updateQuantity(cartItemId: string, quantity: number): void {
    this.cartItems.update(items =>
      items.map(item => (item.id === cartItemId ? { ...item, quantity } : item))
           .filter(item => item.quantity > 0)
    );
  }

  removeFromCart(cartItemId: string): void {
    this.cartItems.update(items => items.filter(item => item.id !== cartItemId));
  }

  clearCart(): void {
    this.cartItems.set([]);
  }
}
