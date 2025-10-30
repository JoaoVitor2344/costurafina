import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductModalComponent } from './components/product-modal/product-modal.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { SupportComponent } from './components/support/support.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { AuthComponent } from './components/auth/auth.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AddressBookComponent } from './components/address-book/address-book.component';
import { Product } from './models/product.model';
import { ProductService } from './services/product.service';

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'name-asc';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, HeaderComponent, FooterComponent, ProductCardComponent, ProductModalComponent, CartComponent, CheckoutComponent, OrderHistoryComponent, SupportComponent, WishlistComponent, AuthComponent, ProfileComponent, AddressBookComponent],
})
export class AppComponent {
  productService = inject(ProductService);

  isCartOpen = signal(false);
  isWishlistOpen = signal(false);
  isCheckoutOpen = signal(false);
  isOrderHistoryOpen = signal(false);
  isSupportOpen = signal(false);
  isAuthOpen = signal(false);
  isProfileOpen = signal(false);
  isAddressBookOpen = signal(false);
  openModalInReviewMode = signal(false);

  products = this.productService.products;

  selectedCategory = signal<string>('All');
  searchTerm = signal<string>('');
  sortOption = signal<SortOption>('relevance');

  selectedProductId = signal<number | null>(null);
  selectedProduct = computed(() => {
    const id = this.selectedProductId();
    if (id === null) {
      return null;
    }
    return this.products().find(p => p.id === id) ?? null;
  });

  sortOptions: { value: SortOption; label: string }[] = [
    { value: 'relevance', label: 'Relevância' },
    { value: 'price-asc', label: 'Preço: Menor para o Maior' },
    { value: 'price-desc', label: 'Preço: Maior para o Menor' },
    { value: 'name-asc', label: 'Nome: A-Z' },
  ];

  categories = computed(() => {
    const allCategories = this.products().map(p => p.category);
    return ['All', ...new Set(allCategories)];
  });

  filteredProducts = computed(() => {
    const category = this.selectedCategory();
    const term = this.searchTerm().toLowerCase();
    const sort = this.sortOption();
    
    let products = this.products();

    // Filter by category
    if (category !== 'All') {
      products = products.filter(p => p.category === category);
    }

    // Filter by search term
    if (term) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }

    // Sort products
    const sortedProducts = [...products]; // Create a new array to avoid mutating the original
    switch (sort) {
        case 'price-asc':
            // FIX: Product does not have a 'price' property. Sorting by the price of the first variant.
            sortedProducts.sort((a, b) => (a.variants[0]?.price ?? 0) - (b.variants[0]?.price ?? 0));
            break;
        case 'price-desc':
            // FIX: Product does not have a 'price' property. Sorting by the price of the first variant.
            sortedProducts.sort((a, b) => (b.variants[0]?.price ?? 0) - (a.variants[0]?.price ?? 0));
            break;
        case 'name-asc':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'relevance':
        default:
             // sort by id for stability on default
            sortedProducts.sort((a, b) => a.id - b.id);
            break;
    }

    return sortedProducts;
  });

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }
  
  onLogoClick(): void {
    this.selectCategory('All');
    this.searchTerm.set('');
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as SortOption;
    this.sortOption.set(value);
  }

  onProductSelected(product: Product): void {
    this.selectedProductId.set(product.id);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  onCloseModal(): void {
    this.selectedProductId.set(null);
    document.body.style.overflow = ''; // Restore background scrolling
    this.openModalInReviewMode.set(false); // Reset the flag
  }

  onCheckout(): void {
    this.isCartOpen.set(false);
    this.isCheckoutOpen.set(true);
  }

  onCloseCheckout(): void {
    this.isCheckoutOpen.set(false);
  }

  onOrderPlaced(): void {
    // The cart is cleared by the cart service.
    // The checkout component now shows a confirmation screen.
    // It will be closed by the user clicking "Continue Shopping" or the close button.
  }

  onOpenOrderHistory(): void {
    this.isProfileOpen.set(false);
    this.isOrderHistoryOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  onCloseOrderHistory(): void {
    this.isOrderHistoryOpen.set(false);
    document.body.style.overflow = '';
  }

  onOpenSupport(): void {
    this.isProfileOpen.set(false);
    this.isSupportOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  onCloseSupport(): void {
    this.isSupportOpen.set(false);
    document.body.style.overflow = '';
  }

  onOpenAuth(): void {
    this.isAuthOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  onCloseAuth(): void {
    this.isAuthOpen.set(false);
    document.body.style.overflow = '';
  }

  onLoginSuccess(): void {
    this.isAuthOpen.set(false);
    document.body.style.overflow = '';
  }

  onOpenProfile(): void {
    this.isProfileOpen.set(true);
  }

  onCloseProfile(): void {
    this.isProfileOpen.set(false);
  }
  
  onOpenAddressBook(): void {
    this.isProfileOpen.set(false);
    this.isAddressBookOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  onCloseAddressBook(): void {
    this.isAddressBookOpen.set(false);
    document.body.style.overflow = '';
  }

  onReviewProduct(productId: number): void {
    const productToReview = this.products().find(p => p.id === productId);
    if (productToReview) {
      this.isOrderHistoryOpen.set(false);
      this.openModalInReviewMode.set(true);
      this.onProductSelected(productToReview);
    }
  }

  onBreadcrumbHomeClick(): void {
    this.onCloseModal();
    this.onLogoClick();
  }

  onBreadcrumbCategoryClick(category: string): void {
    this.onCloseModal();
    this.selectCategory(category);
  }
}