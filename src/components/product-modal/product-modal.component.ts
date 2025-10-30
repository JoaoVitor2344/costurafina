import { Component, ChangeDetectionStrategy, input, output, signal, computed, inject, effect } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Product, Review, ProductColor } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { ReviewFormComponent } from '../review-form/review-form.component';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgOptimizedImage, ReviewFormComponent],
})
export class ProductModalComponent {
  product = input.required<Product | null>();
  openInReviewMode = input<boolean>(false);
  close = output<void>();
  openCart = output<void>();
  homeClicked = output<void>();
  categoryClicked = output<string>();

  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  authService = inject(AuthService);
  productService = inject(ProductService);
  orderService = inject(OrderService);

  currentImageIndex = signal(0);
  isZoomed = signal(false);
  isWritingReview = signal(false);

  // Variant selection state
  selectedSize = signal<string | null>(null);
  selectedColor = signal<ProductColor | null>(null);

  constructor() {
    effect(() => {
      // Reset selections when product changes
      if (this.product()) {
        this.resetSelections();
      }

      // Automatically open review form if requested
      if (this.product() && this.openInReviewMode() && this.canShowReviewButton()) {
        this.isWritingReview.set(true);
      }
    });
  }

  resetSelections(): void {
    this.currentImageIndex.set(0);
    this.selectedSize.set(null);
    this.selectedColor.set(null);
    this.isWritingReview.set(false);
  }

  selectedVariant = computed(() => {
    const p = this.product();
    const size = this.selectedSize();
    const color = this.selectedColor();
    if (!p || !size || !color) return null;
    return p.variants.find(v => v.size === size && v.color.name === color.name) ?? null;
  });

  isInCart = computed(() => {
    const v = this.selectedVariant();
    const p = this.product();
    if (!p || !v) return false;
    const cartItemId = `${p.id}-${v.sku}`;
    return this.cartService.cartItems().some(item => item.id === cartItemId);
  });
  
  currentPrice = computed(() => {
    return this.selectedVariant()?.price ?? this.product()?.variants[0]?.price ?? 0;
  });
  
  currentStock = computed(() => {
    return this.selectedVariant()?.stock ?? 0;
  });
  
  isSoldOut = computed(() => {
    const v = this.selectedVariant();
    if (this.selectedSize() && this.selectedColor() && !v) return true; // Invalid combination
    return v ? v.stock <= 0 : false;
  });
  
  canAddToCart = computed(() => {
    return !!this.selectedVariant() && !this.isSoldOut();
  });

  currentImageUrl = computed(() => {
    const p = this.product();
    const color = this.selectedColor();
    const variantImage = this.selectedVariant()?.image;

    // Prioritize variant image if a color is selected
    if (color && variantImage) {
      return variantImage;
    }
    
    // Fallback to general image gallery
    const index = this.currentImageIndex();
    if (p && p.imageUrls && p.imageUrls.length > index) {
      return p.imageUrls[index];
    }
    return '';
  });

  starRating = computed(() => {
    const p = this.product();
    if (!p) return [];
    const roundedRating = Math.round(p.rating);
    return Array.from({ length: 5 }, (_, i) => i < roundedRating);
  });
  
  reviewCount = computed(() => this.product()?.reviews?.length ?? 0);

  averageRating = computed(() => this.product()?.rating ?? 0);

  hasPurchased = computed(() => {
    const p = this.product();
    if (!p) return false;
    return this.orderService.hasPurchasedAndReceived(p.id);
  });

  hasReviewed = computed(() => {
    const p = this.product();
    if (!p) return false;
    return this.productService.hasUserReviewed(p.id);
  });

  canShowReviewButton = computed(() => {
    return this.authService.isLoggedIn() && this.hasPurchased() && !this.hasReviewed();
  });

  reviewPromptMessage = computed(() => {
    if (!this.authService.isLoggedIn() || !this.product()) return '';
    if (this.hasPurchased() && !this.hasReviewed()) {
      return "Você comprou este item. Compartilhe sua opinião!";
    }
    if (this.hasReviewed()) {
      return "Você já avaliou este item. Obrigado pelo seu feedback!";
    }
    return '';
  });

  onClose(event: MouseEvent): void {
    if ((event.target as HTMLElement).id === 'modal-backdrop') {
      this.close.emit();
    }
  }

  selectImage(index: number): void {
    this.currentImageIndex.set(index);
    // Clear color selection if user interacts with main gallery
    this.selectedColor.set(null);
  }
  
  selectSize(size: string): void {
    this.selectedSize.set(size);
  }

  selectColor(color: ProductColor): void {
    this.selectedColor.set(color);
  }

  nextImage(): void {
    if (this.product()) {
      this.currentImageIndex.update(i => (i + 1) % this.product()!.imageUrls.length);
    }
  }

  prevImage(): void {
    if (this.product()) {
      this.currentImageIndex.update(i => (i - 1 + this.product()!.imageUrls.length) % this.product()!.imageUrls.length);
    }
  }

  toggleZoom(event?: MouseEvent): void {
    event?.stopPropagation();
    this.isZoomed.update(v => !v);
  }

  addToCart(): void {
    const p = this.product();
    const v = this.selectedVariant();
    if (p && v && this.canAddToCart()) {
      this.cartService.addToCart(p, v);
    }
  }
  
  goToCart(): void {
    this.close.emit();
    this.openCart.emit();
  }
  
  toggleWishlist(): void {
    const p = this.product();
    if (p) {
      this.wishlistService.toggleWishlist(p);
    }
  }

  handleReviewSubmitted(review: Review): void {
    const p = this.product();
    if (p) {
      this.productService.addReview(p.id, review);
      this.isWritingReview.set(false);
    }
  }

  getReviewStars(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }

  onHomeClick(): void {
    this.homeClicked.emit();
  }
  
  onCategoryClick(category: string): void {
    this.categoryClicked.emit(category);
  }
}