export interface Review {
  userId: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductVariant {
  sku: string; // Stock Keeping Unit, e.g., 'TS001-M-BLK'
  size: string;
  color: ProductColor;
  stock: number;
  price: number;
  image: string; // Image specific to this variant/color
}

export interface Product {
  id: number;
  name: string;
  category: string;
  imageUrls: string[]; // General images, or showcase images
  description: string;
  rating: number;
  reviews: Review[];
  variants: ProductVariant[];
  availableSizes: string[];
  availableColors: ProductColor[];
}
