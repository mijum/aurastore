export type ProductCategory = 
  | 'All'
  | 'Clothing'
  | 'Shoes'
  | 'Accessories'
  | 'Electronics'
  | 'Bags'
  | 'Watches';

export interface ProductReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  price: number; // in BDT ৳
  discountPrice?: number;
  rating: number;
  reviewCount: number;
  description: string;
  details: string[];
  specifications: Record<string, string>;
  stock: number;
  images: string[];
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  featured?: boolean;
  newArrival?: boolean;
  tags: string[];
  reviews: ProductReview[];
  sku?: string;
  categoryId?: string;
  status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED' | 'OUT_OF_STOCK';
  lowStockThreshold?: number;
  stockQuantity?: number;
  reservedQuantity?: number;
  costPrice?: number;
  brand?: string;
  isBestSeller?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  cartItemId: string; // generated unique id combining productId + size + color
  productId: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: { name: string; hex: string };
  priceAtAddition: number;
}

export interface Coupon {
  code: string;
  discountPercentage?: number; // e.g. 20 for 20%
  fixedDiscount?: number;
  freeShipping?: boolean;
  minSpend?: number;
  description: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  streetAddress: string;
  area: string;
  city: string;
  district: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  deliveryRegion?: DeliveryRegion;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  joinedDate: string;
  addresses: Address[];
  isDemoUser?: boolean;
}

export type DeliveryMethod = 'standard' | 'express';
export type DeliveryRegion = 'dhaka_city' | 'dhaka_subarea' | 'outside_dhaka';
export type FreeDeliveryRequirement = 'EITHER' | 'BOTH';
export interface ShippingSettings {
  dhakaCityFee: number;
  dhakaSubAreaFee: number;
  outsideDhakaFee: number;
  expressSurcharge: number;
  freeDeliveryEnabled: boolean;
  freeDeliveryMinAmount: number;
  freeDeliveryMinItems: number;
  freeDeliveryRequirement: FreeDeliveryRequirement;
  taxRate: number;
}
export type PaymentMethod = 'cod' | 'card' | 'mobile_payment';
export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: { name: string; hex: string };
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  userId?: string;
  guestId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    streetAddress: string;
    area: string;
    city: string;
    district: string;
    postalCode: string;
    country: string;
    deliveryRegion?: DeliveryRegion;
  };
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  status: OrderStatus;
  estimatedDelivery: string;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';

export interface FilterState {
  category: ProductCategory;
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  sortBy: SortOption;
  viewMode: 'grid' | 'list';
}
