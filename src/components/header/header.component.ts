import { Component, ChangeDetectionStrategy, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class HeaderComponent {
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  authService = inject(AuthService);

  logoClicked = output<void>();
  cartClicked = output<void>();
  wishlistClicked = output<void>();
  authClicked = output<void>();
  profileClicked = output<void>();

  isMobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
  }

  onProfileClick(): void {
    this.profileClicked.emit();
    this.isMobileMenuOpen.set(false);
  }

  onAuthClick(): void {
    this.authClicked.emit();
    this.isMobileMenuOpen.set(false);
  }
}
