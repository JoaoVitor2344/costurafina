import { Component, ChangeDetectionStrategy, input, output, inject, signal, computed, effect } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { EmailService } from '../../services/email.service';
import { Address } from '../../models/address.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgOptimizedImage],
})
export class CheckoutComponent {
  isOpen = input.required<boolean>();
  close = output<void>();
  orderPlaced = output<void>();

  cartService = inject(CartService);
  orderService = inject(OrderService);
  authService = inject(AuthService);
  emailService = inject(EmailService);

  isOrderConfirmed = signal(false);
  isProcessing = signal(false);
  error = signal<string | null>(null);

  // Form state
  name = signal('');
  email = signal('');
  address = signal('');
  city = signal('');
  postalCode = signal('');
  cardNumber = signal('');
  cardExpiry = signal('');
  cardCvc = signal('');
  
  selectedAddressId = signal<string | null>(null);

  // Costs
  shippingCost = computed(() => this.cartService.subtotal() > 100 ? 0 : 10.00);
  taxAmount = computed(() => this.cartService.subtotal() * 0.08); // 8% tax
  totalAmount = computed(() => this.cartService.subtotal() + this.shippingCost() + this.taxAmount());
  
  isFormValid = computed(() => {
    const cardNumberValid = /^\d{16}$/.test(this.cardNumber().replace(/\s/g, ''));
    const expiryValid = /^(0[1-9]|1[0-2])\s*\/\s*([0-9]{2})$/.test(this.cardExpiry());
    const cvcValid = /^\d{3,4}$/.test(this.cardCvc());

    return this.name().trim() !== '' &&
           this.email().trim().includes('@') &&
           this.address().trim() !== '' &&
           this.city().trim() !== '' &&
           this.postalCode().trim() !== '' &&
           cardNumberValid &&
           expiryValid &&
           cvcValid;
  });

  constructor() {
    effect(() => {
        if(this.isOpen()) {
            this.isOrderConfirmed.set(false); // Reset confirmation state when modal opens
            this.selectedAddressId.set(null); // Reset address selection
            const user = this.authService.currentUser();
            if (user) {
              this.name.set(user.name);
              this.email.set(user.email);
            }
        }
    });
  }
  
  selectAddress(address: Address): void {
    this.selectedAddressId.set(address.id);
    this.name.set(address.name);
    this.address.set(address.address);
    this.city.set(address.city);
    this.postalCode.set(address.postalCode);
  }

  placeOrder(event: Event): void {
    event.preventDefault();
    if (!this.isFormValid()) {
      this.error.set('Please fill out all fields correctly.');
      setTimeout(() => this.error.set(null), 3000); // Clear error after 3s
      return;
    }
    this.error.set(null);
    this.isProcessing.set(true);
    
    // Simulate payment processing and order placement
    setTimeout(() => {
      const newOrder = this.orderService.placeOrder(this.cartService.cartItems(), this.totalAmount());

      if (newOrder) {
        const currentUser = this.authService.currentUser();
        if (currentUser) {
            this.emailService.sendOrderConfirmation(currentUser, newOrder);
        }
        this.cartService.clearCart();
        this.isOrderConfirmed.set(true);
        this.orderPlaced.emit();
      } else {
        this.error.set('There was an issue placing your order. Please try again.');
      }
      
      this.isProcessing.set(false);
    }, 2000);
  }

  continueShopping(): void {
    this.close.emit();
  }
}
