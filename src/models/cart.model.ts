import { ProductVariant } from './product.model';

export interface CartItem {
  id: string; // Composite key: `${productId}-${variant.sku}`
  productId: number;
  name: string;
  image: string; // Variant-specific image
  price: number; // Variant-specific price
  variant: ProductVariant;
  quantity: number;
  category: string;
}
