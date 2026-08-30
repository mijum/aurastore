import React, { createContext, useContext, useState, useEffect, useMemo, useRef, ReactNode } from 'react';
import {
  Product,
  CartItem,
  User,
  Order,
  Coupon,
  Toast,
  ToastType,
  FilterState,
  ProductCategory,
  SortOption,
  DeliveryMethod,
  PaymentMethod,
  Address,
  DeliveryRegion,
  ShippingSettings
} from '../types';
import { DEFAULT_SHIPPING_SETTINGS, INITIAL_PRODUCTS, VALID_COUPONS } from '../data/products';
import { ApiError, publicApi } from '../services/api';
import { calculateShippingFee } from '../utils/shipping';

interface StoreContextType {
  // Products & Reviews
  products: Product[];
  productsLoading: boolean;
  productsError: string | null;
  refreshProducts: () => Promise<void>;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  submitReview: (productId: string, rating: number, comment: string, userName?: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedSize?: string, selectedColor?: { name: string; hex: string }) => boolean;
  updateCartQuantity: (cartItemId: string, newQuantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Cart Calculations
  cartCount: number;
  cartSubtotal: number;
  cartTax: number;
  cartShippingFee: number;
  cartDiscount: number;
  cartTotal: number;
  selectedDeliveryMethod: DeliveryMethod;
  setSelectedDeliveryMethod: (method: DeliveryMethod) => void;
  selectedDeliveryRegion: DeliveryRegion;
  setSelectedDeliveryRegion: (region: DeliveryRegion) => void;
  shippingSettings: ShippingSettings;

  // Coupon
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  moveToCartFromWishlist: (productId: string, size?: string, color?: { name: string; hex: string }) => boolean;

  // Recently Viewed
  recentlyViewed: string[]; // product IDs
  addRecentlyViewed: (productId: string) => void;

  // Auth & Profile
  currentUser: User | null;
  login: (email: string, password: string, rememberMe?: boolean) => { success: boolean; message: string };
  register: (name: string, email: string, phone: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  deleteAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;

  // Orders
  orders: Order[];
  placeOrder: (
    customerDetails: {
      fullName: string;
      email: string;
      phone: string;
      streetAddress: string;
      area: string;
      city: string;
      district: string;
      postalCode: string;
      country: string;
      deliveryRegion: DeliveryRegion;
    },
    deliveryMethod: DeliveryMethod,
    paymentMethod: PaymentMethod
  ) => Promise<{ success: boolean; order?: Order; message: string }>;
  getOrderById: (orderId: string) => Order | undefined;

  // Filters & Sorting
  filters: FilterState;
  setCategory: (category: ProductCategory) => void;
  setSearchQuery: (query: string) => void;
  setPriceRange: (min: number, max: number) => void;
  setMinRating: (rating: number) => void;
  setInStockOnly: (inStock: boolean) => void;
  setSortBy: (sort: SortOption) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  resetFilters: () => void;
  filteredProducts: Product[];

  // Quick View & Modals
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  // Toasts
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;

  // Mobile navigation
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean) => void;
}

const DEFAULT_FILTERS: FilterState = {
  category: 'All',
  searchQuery: '',
  minPrice: 0,
  maxPrice: 20000,
  minRating: 0,
  inStockOnly: false,
  sortBy: 'featured',
  viewMode: 'grid',
};

const DEFAULT_DEMO_USERS = [
  {
    id: 'user-demo-1',
    name: 'Tawhid Namikaze',
    email: 'demo@aurastore.com',
    phone: '01712345678',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    joinedDate: '2026-01-15',
    password: 'password123',
    addresses: [
      {
        id: 'addr-1',
        fullName: 'Tawhid Namikaze',
        phone: '01712345678',
        streetAddress: 'House 42, Road 11, Banani',
        area: 'Banani',
        city: 'Dhaka',
        district: 'Dhaka',
        postalCode: '1213',
        country: 'Bangladesh',
        isDefault: true,
      }
    ],
    isDemoUser: true,
  }
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Safe LocalStorage helpers
  const getStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.warn(`Error reading localStorage key "${key}":`, e);
      return fallback;
    }
  };

  const setStored = <T,>(key: string, value: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error setting localStorage key "${key}":`, e);
    }
  };

  const [guestId] = useState<string>(() => {
    const existingGuestId = getStored<string>('aurastore_guest_id', '');
    if (existingGuestId) return existingGuestId;

    const newGuestId = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setStored('aurastore_guest_id', newGuestId);
    return newGuestId;
  });

  // --- STATE ---
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  const [cart, setCart] = useState<CartItem[]>(() => {
    return getStored('aurastore_cart', []);
  });
  const cartRef = useRef(cart);

  const [wishlist, setWishlist] = useState<string[]>(() => {
    return getStored('aurastore_wishlist', []);
  });

  const [registeredUsers, setRegisteredUsers] = useState<any[]>(() => {
    return getStored('aurastore_accounts', DEFAULT_DEMO_USERS);
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return getStored('aurastore_current_user', null);
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    return getStored('aurastore_orders', []);
  });

  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    return getStored('aurastore_recent', []);
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    return getStored('aurastore_coupon', null);
  });

  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<DeliveryMethod>('standard');
  const [selectedDeliveryRegion, setSelectedDeliveryRegion] = useState<DeliveryRegion>('dhaka_city');
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>(DEFAULT_SHIPPING_SETTINGS);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync state to LocalStorage
  const refreshProducts = async () => {
    setProductsLoading(true);
    try {
      const result = await publicApi.products({ limit: 100 });
      setProducts(result.items);
      setProductsError(null);
      setCart((previous) => previous.flatMap((item) => {
        const current = result.items.find((product) => product.id === item.productId);
        return current ? [{ ...item, product: current }] : [];
      }));
    } catch (error) {
      // Keep the storefront usable in local/demo mode when the API or database is unavailable.
      setProducts(INITIAL_PRODUCTS);
      setProductsError(null);
      setCart((previous) => previous.flatMap((item) => {
        const current = INITIAL_PRODUCTS.find((product) => product.id === item.productId);
        return current ? [{ ...item, product: current }] : [];
      }));
      console.warn('Product API unavailable; using the bundled catalog.', error);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => { void refreshProducts(); }, []);
  useEffect(() => {
    void publicApi.shippingSettings().then(setShippingSettings).catch((error) => console.warn('Using default shipping settings.', error));
  }, []);

  useEffect(() => {
    cartRef.current = cart;
    setStored('aurastore_cart', cart);
  }, [cart]);

  useEffect(() => {
    setStored('aurastore_wishlist', wishlist);
  }, [wishlist]);

  useEffect(() => {
    setStored('aurastore_accounts', registeredUsers);
  }, [registeredUsers]);

  useEffect(() => {
    setStored('aurastore_current_user', currentUser);
  }, [currentUser]);

  useEffect(() => {
    setStored('aurastore_orders', orders);
  }, [orders]);

  useEffect(() => {
    if (!currentUser) return;

    let cancelled = false;
    void publicApi.orderHistory(currentUser.id, currentUser.email)
      .then((databaseOrders) => {
        if (cancelled) return;
        setOrders((previous) => {
          const merged = new Map(previous.map((order) => [order.id, order]));
          databaseOrders.forEach((order) => merged.set(order.id, { ...order, userId: currentUser.id }));
          return [...merged.values()].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        });
      })
      .catch((error) => console.warn('Unable to refresh account order history.', error));

    return () => { cancelled = true; };
  }, [currentUser?.id, currentUser?.email]);

  useEffect(() => {
    setStored('aurastore_recent', recentlyViewed);
  }, [recentlyViewed]);

  useEffect(() => {
    setStored('aurastore_coupon', appliedCoupon);
  }, [appliedCoupon]);

  // --- TOAST SYSTEM ---
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToast = (message: string, type: ToastType = 'info', duration: number = 3500) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: Toast = { id, message, type, duration };
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  // --- PRODUCT HELPERS ---
  const getProductBySlug = (slug: string) => {
    return products.find((p) => p.slug === slug);
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  const submitReview = (productId: string, rating: number, comment: string, userName?: string) => {
    const author = userName || currentUser?.name || 'Guest Shopper';
    const isVerifiedPurchase = Boolean(
      currentUser &&
      orders.some(
        (order) =>
          order.userId === currentUser.id &&
          order.items.some((item) => item.productId === productId)
      )
    );
    const newReview = {
      id: `rev-${Date.now()}`,
      userName: author,
      rating,
      date: new Date().toISOString().split('T')[0],
      comment,
      verifiedPurchase: isVerifiedPurchase,
    };

    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          const updatedReviews = [newReview, ...prod.reviews];
          const newReviewCount = prod.reviewCount + 1;
          const newAvgRating = Number(
            ((prod.rating * prod.reviewCount + rating) / newReviewCount).toFixed(1)
          );
          return {
            ...prod,
            reviews: updatedReviews,
            reviewCount: newReviewCount,
            rating: newAvgRating,
          };
        }
        return prod;
      })
    );

    addToast('Thank you! Your review has been published.', 'success');
  };

  // --- RECENTLY VIEWED ---
  const addRecentlyViewed = (productId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 8);
    });
  };

  // --- CART MANAGEMENT ---
  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedSize?: string,
    selectedColor?: { name: string; hex: string }
  ): boolean => {
    if (product.stock <= 0) {
      addToast('Sorry, this product is currently out of stock.', 'error');
      return false;
    }

    // Default to first variant if none selected and product has options
    const finalSize = selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);
    const finalColor = selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0] : undefined);

    const currentCart = cartRef.current;
    const cartItemId = `${product.id}-${finalSize || 'none'}-${finalColor?.name || 'none'}`;
    const existingIndex = currentCart.findIndex((item) => item.cartItemId === cartItemId);
    const effectivePrice = product.discountPrice ?? product.price;
    const currentProductQuantity = currentCart
      .filter((item) => item.productId === product.id)
      .reduce((sum, item) => sum + item.quantity, 0);

    if (currentProductQuantity + quantity > product.stock) {
      addToast(
        `Cannot add more. Only ${product.stock} total units are available across all variants.`,
        'warning'
      );
      return false;
    }

    if (existingIndex > -1) {
      const currentQty = currentCart[existingIndex].quantity;
      const newTotalQty = currentQty + quantity;

      const nextCart = currentCart.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: newTotalQty } : item
      );
      cartRef.current = nextCart;
      setCart(nextCart);
      addToast(`Updated quantity in cart (${newTotalQty})`, 'success');
    } else {
      if (quantity > product.stock) {
        addToast(`Only ${product.stock} units available in stock.`, 'warning');
        return false;
      }

      const newItem: CartItem = {
        cartItemId,
        productId: product.id,
        product,
        quantity,
        selectedSize: finalSize,
        selectedColor: finalColor,
        priceAtAddition: effectivePrice,
      };
      const nextCart = [newItem, ...currentCart];
      cartRef.current = nextCart;
      setCart(nextCart);
      addToast(`Added "${product.name}" to cart!`, 'success');
    }

    return true;
  };

  const updateCartQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart((prev) => {
      const nextCart = prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const liveProduct = products.find((p) => p.id === item.productId) || item.product;
          const otherVariantQuantity = prev
            .filter(
              (cartItem) =>
                cartItem.productId === item.productId && cartItem.cartItemId !== cartItemId
            )
            .reduce((sum, cartItem) => sum + cartItem.quantity, 0);
          const maximumForVariant = Math.max(0, liveProduct.stock - otherVariantQuantity);
          if (newQuantity > maximumForVariant) {
            addToast(`Maximum available quantity for this variant is ${maximumForVariant}`, 'warning');
            return { ...item, quantity: maximumForVariant };
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      cartRef.current = nextCart;
      return nextCart;
    });
  };

  const removeFromCart = (cartItemId: string) => {
    const item = cartRef.current.find((i) => i.cartItemId === cartItemId);
    const nextCart = cartRef.current.filter((i) => i.cartItemId !== cartItemId);
    cartRef.current = nextCart;
    setCart(nextCart);
    if (item) {
      addToast(`Removed "${item.product.name}" from cart.`, 'info');
    }
  };

  const clearCart = () => {
    cartRef.current = [];
    setCart([]);
  };

  // --- CART CALCULATIONS ---
  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.priceAtAddition * item.quantity, 0);
  }, [cart]);

  const cartShippingFee = useMemo(() => {
    if (cart.length === 0) return 0;
    if (appliedCoupon?.freeShipping) return 0;

    return calculateShippingFee(shippingSettings, cartSubtotal, cartCount, selectedDeliveryRegion, selectedDeliveryMethod);
  }, [cart.length, cartSubtotal, cartCount, appliedCoupon, selectedDeliveryMethod, selectedDeliveryRegion, shippingSettings]);

  const cartDiscount = useMemo(() => {
    if (!appliedCoupon || cartSubtotal <= 0) return 0;

    if (appliedCoupon.discountPercentage) {
      return Math.round((cartSubtotal * appliedCoupon.discountPercentage) / 100);
    }
    if (appliedCoupon.fixedDiscount) {
      if (appliedCoupon.minSpend && cartSubtotal < appliedCoupon.minSpend) {
        return 0;
      }
      return Math.min(cartSubtotal, appliedCoupon.fixedDiscount);
    }
    return 0;
  }, [cartSubtotal, appliedCoupon]);

  const cartTax = useMemo(() => {
    if (cartSubtotal <= 0) return 0;
    const taxableAmount = Math.max(0, cartSubtotal - cartDiscount);
    return Math.round(taxableAmount * shippingSettings.taxRate);
  }, [cartSubtotal, cartDiscount, shippingSettings.taxRate]);

  const cartTotal = useMemo(() => {
    if (cart.length === 0) return 0;
    return Math.max(0, cartSubtotal - cartDiscount + cartShippingFee + cartTax);
  }, [cart.length, cartSubtotal, cartDiscount, cartShippingFee, cartTax]);

  // --- COUPON MANAGEMENT ---
  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'Please enter a coupon code.' };
    }

    if (appliedCoupon?.code === cleanCode) {
      return { success: false, message: `Coupon "${cleanCode}" is already applied.` };
    }

    try {
      const result = await publicApi.validateCoupon(cleanCode, cartSubtotal);
      const matched: Coupon = {
        code: result.code,
        discountPercentage: result.type === 'PERCENTAGE' ? result.value : undefined,
        fixedDiscount: result.type === 'FIXED' ? result.value : undefined,
        description: `${result.code} promotion`,
      };
      setAppliedCoupon(matched);
      addToast(`Coupon "${cleanCode}" applied successfully!`, 'success');
      return { success: true, message: `Coupon "${cleanCode}" applied!` };
    } catch (error) {
      const localCoupon = VALID_COUPONS.find((c) => c.code.toUpperCase() === cleanCode);
      if (localCoupon) {
        if (localCoupon.minSpend && cartSubtotal < localCoupon.minSpend) {
          return { success: false, message: `Minimum spend of à§³${localCoupon.minSpend} required.` };
        }
        setAppliedCoupon(localCoupon);
        addToast(`Coupon "${cleanCode}" applied successfully!`, 'success');
        return { success: true, message: `Coupon "${cleanCode}" applied!` };
      }
      return { success: false, message: error instanceof Error ? error.message : 'Coupon could not be validated.' };
    }
  };

  const removeCoupon = () => {
    if (appliedCoupon) {
      const code = appliedCoupon.code;
      setAppliedCoupon(null);
      addToast(`Coupon "${code}" removed.`, 'info');
    }
  };

  // --- WISHLIST MANAGEMENT ---
  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const toggleWishlist = (productId: string) => {
    const product = getProductById(productId);
    const name = product ? product.name : 'Product';

    if (isInWishlist(productId)) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      addToast(`Removed "${name}" from your wishlist.`, 'info');
    } else {
      setWishlist((prev) => [productId, ...prev]);
      addToast(`Added "${name}" to your wishlist!`, 'success');
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((id) => id !== productId));
  };

  const moveToCartFromWishlist = (
    productId: string,
    size?: string,
    color?: { name: string; hex: string }
  ): boolean => {
    const product = getProductById(productId);
    if (!product) return false;

    const added = addToCart(product, 1, size, color);
    if (added) {
      removeFromWishlist(productId);
      return true;
    }
    return false;
  };

  // --- AUTHENTICATION ---
  const login = (email: string, password: string): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const foundUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === password
    );

    if (!foundUser) {
      return { success: false, message: 'Invalid email or password. Check demo credentials below.' };
    }

    const { password: _, ...userProfile } = foundUser;
    setCurrentUser(userProfile as User);
    addToast(`Welcome back, ${userProfile.name}!`, 'success');
    return { success: true, message: 'Login successful' };
  };

  const register = (
    name: string,
    email: string,
    phone: string,
    password: string
  ): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      joinedDate: new Date().toISOString().split('T')[0],
      password,
      addresses: [],
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    const { password: _, ...userProfile } = newUser;
    setCurrentUser(userProfile as User);
    addToast(`Welcome to AuraStore, ${name}! Your account is ready.`, 'success');
    return { success: true, message: 'Registration successful' };
  };

  const logout = () => {
    setCurrentUser(null);
    addToast('You have been safely logged out.', 'info');
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const updated: User = { ...currentUser, ...updatedData };
    setCurrentUser(updated);
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...updatedData } : u))
    );
    addToast('Profile updated successfully!', 'success');
  };

  const addAddress = (addressData: Omit<Address, 'id'>) => {
    if (!currentUser) return;
    const newAddress: Address = {
      ...addressData,
      id: `addr-${Date.now()}`,
    };

    const currentAddresses = currentUser.addresses || [];
    let updatedAddresses = currentAddresses;
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
    } else if (currentAddresses.length === 0) {
      newAddress.isDefault = true;
    }

    updatedAddresses = [...updatedAddresses, newAddress];
    updateProfile({ addresses: updatedAddresses });
  };

  const deleteAddress = (addressId: string) => {
    if (!currentUser) return;
    const updatedAddresses = (currentUser.addresses || []).filter((a) => a.id !== addressId);
    updateProfile({ addresses: updatedAddresses });
    addToast('Address deleted.', 'info');
  };

  const setDefaultAddress = (addressId: string) => {
    if (!currentUser) return;
    const updatedAddresses = (currentUser.addresses || []).map((a) => ({
      ...a,
      isDefault: a.id === addressId,
    }));
    updateProfile({ addresses: updatedAddresses });
    addToast('Default address updated.', 'success');
  };

  // --- ORDERS & CHECKOUT ---
  const placeOrder = async (
    customerDetails: {
      fullName: string;
      email: string;
      phone: string;
      streetAddress: string;
      area: string;
      city: string;
      district: string;
      postalCode: string;
      country: string;
      deliveryRegion: DeliveryRegion;
    },
    deliveryMethod: DeliveryMethod,
    paymentMethod: PaymentMethod
  ): Promise<{ success: boolean; order?: Order; message: string }> => {
    if (cart.length === 0) {
      return { success: false, message: 'Your cart is empty.' };
    }

    // Check combined stock across every variant of the same product.
    const requestedQuantities = cart.reduce<Record<string, number>>((totals, item) => {
      totals[item.productId] = (totals[item.productId] || 0) + item.quantity;
      return totals;
    }, {});

    for (const [productId, requestedQuantity] of Object.entries(requestedQuantities)) {
      const liveProduct = products.find((p) => p.id === productId);
      if (!liveProduct) {
        const unavailableItem = cart.find((item) => item.productId === productId);
        return { success: false, message: `Product "${unavailableItem?.product.name || productId}" is no longer available.` };
      }
      if (liveProduct.stock < requestedQuantity) {
        return {
          success: false,
          message: `Insufficient stock for "${liveProduct.name}". Only ${liveProduct.stock} left in stock.`,
        };
      }
    }

    try {
      const created = await publicApi.createOrder({
        accountId: currentUser?.id,
        accountEmail: currentUser?.email,
        customer: customerDetails,
        items: cart.map(({ productId, quantity, selectedSize, selectedColor }) => ({ productId, quantity, selectedSize, selectedColor })),
        couponCode: appliedCoupon?.code,
        deliveryMethod,
        paymentMethod,
      });
      const newOrder = { ...created, status: 'Processing' as const, userId: currentUser?.id, guestId: currentUser ? undefined : guestId };
      setOrders((previous) => [newOrder, ...previous]);
      clearCart();
      setAppliedCoupon(null);
      void refreshProducts();
      addToast(`Order #${newOrder.orderNumber} placed successfully!`, 'success');
      return { success: true, order: newOrder, message: 'Order created' };
    } catch (error) {
      const canUseLocalFallback = !(error instanceof ApiError) || error.status >= 500;
      if (!canUseLocalFallback) {
        return { success: false, message: error.message };
      }

      // Local/demo checkout fallback when the API database is unavailable.
      const now = new Date();
      const deliveryDays = deliveryMethod === 'express' ? 2 : 4;
      const estimatedDelivery = new Date(now.getTime() + deliveryDays * 86400000);
      const newOrder: Order = {
        id: `local-order-${now.getTime()}`,
        orderNumber: `AURA-${now.getFullYear()}-${String(now.getTime()).slice(-8)}`,
        date: now.toISOString(),
        userId: currentUser?.id,
        guestId: currentUser ? undefined : guestId,
        customerName: customerDetails.fullName,
        customerEmail: customerDetails.email,
        customerPhone: customerDetails.phone,
        shippingAddress: {
          streetAddress: customerDetails.streetAddress,
          area: customerDetails.area,
          city: customerDetails.city,
          district: customerDetails.district,
          postalCode: customerDetails.postalCode,
          country: customerDetails.country,
          deliveryRegion: customerDetails.deliveryRegion,
        },
        deliveryMethod,
        paymentMethod,
        items: cart.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          productImage: item.product.images[0],
          price: item.priceAtAddition,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          total: item.priceAtAddition * item.quantity,
        })),
        subtotal: cartSubtotal,
        tax: cartTax,
        shippingFee: cartShippingFee,
        discount: cartDiscount,
        couponCode: appliedCoupon?.code,
        total: cartTotal,
        status: 'Processing',
        estimatedDelivery: estimatedDelivery.toISOString().split('T')[0],
      };

      setOrders((previous) => [newOrder, ...previous]);
      clearCart();
      setAppliedCoupon(null);
      addToast(`Order #${newOrder.orderNumber} placed successfully!`, 'success');
      console.warn('Order API unavailable; saved order locally.', error);
      return { success: true, order: newOrder, message: 'Order saved locally' };
    }
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  };

  // --- FILTERS & SEARCH ---
  const setCategory = (category: ProductCategory) => {
    setFilters((prev) => ({ ...prev, category }));
  };

  const setSearchQuery = (searchQuery: string) => {
    setFilters((prev) => ({ ...prev, searchQuery }));
  };

  const setPriceRange = (minPrice: number, maxPrice: number) => {
    setFilters((prev) => ({ ...prev, minPrice, maxPrice }));
  };

  const setMinRating = (minRating: number) => {
    setFilters((prev) => ({ ...prev, minRating }));
  };

  const setInStockOnly = (inStockOnly: boolean) => {
    setFilters((prev) => ({ ...prev, inStockOnly }));
  };

  const setSortBy = (sortBy: SortOption) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  const setViewMode = (viewMode: 'grid' | 'list') => {
    setFilters((prev) => ({ ...prev, viewMode }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (filters.category !== 'All' && product.category !== filters.category) {
          return false;
        }

        // Search query filter (matches name, description, category, tags)
        if (filters.searchQuery.trim()) {
          const query = filters.searchQuery.toLowerCase().trim();
          const matchesName = product.name.toLowerCase().includes(query);
          const matchesCategory = product.category.toLowerCase().includes(query);
          const matchesDesc = product.description.toLowerCase().includes(query);
          const matchesTags = product.tags.some((t) => t.toLowerCase().includes(query));

          if (!matchesName && !matchesCategory && !matchesDesc && !matchesTags) {
            return false;
          }
        }

        // Price filter
        const effectivePrice = product.discountPrice ?? product.price;
        if (effectivePrice < filters.minPrice || effectivePrice > filters.maxPrice) {
          return false;
        }

        // Rating filter
        if (filters.minRating > 0 && product.rating < filters.minRating) {
          return false;
        }

        // In-stock only
        if (filters.inStockOnly && product.stock <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountPrice ?? a.price;
        const priceB = b.discountPrice ?? b.price;

        switch (filters.sortBy) {
          case 'price-asc':
            return priceA - priceB;
          case 'price-desc':
            return priceB - priceA;
          case 'rating':
            return b.rating - a.rating;
          case 'newest':
            return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
          case 'featured':
          default:
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        }
      });
  }, [products, filters]);

  // --- QUICK VIEW ---
  const openQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        productsLoading,
        productsError,
        refreshProducts,
        getProductBySlug,
        getProductById,
        submitReview,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        cartCount,
        cartSubtotal,
        cartTax,
        cartShippingFee,
        cartDiscount,
        cartTotal,
        selectedDeliveryMethod,
        setSelectedDeliveryMethod,
        selectedDeliveryRegion,
        setSelectedDeliveryRegion,
        shippingSettings,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        moveToCartFromWishlist,
        recentlyViewed,
        addRecentlyViewed,
        currentUser,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        orders,
        placeOrder,
        getOrderById,
        filters,
        setCategory,
        setSearchQuery,
        setPriceRange,
        setMinRating,
        setInStockOnly,
        setSortBy,
        setViewMode,
        resetFilters,
        filteredProducts,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        toasts,
        addToast,
        removeToast,
        isMobileNavOpen,
        setIsMobileNavOpen,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

