import React, { createContext, ReactNode, useCallback, useContext, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { Product } from '../types';
import { useStore } from './StoreContext';
import { flyProductToCart } from '../utils/cartAnimation';

interface AnimateAddOptions {
  product: Product;
  sourceElement: HTMLElement | null;
  quantity?: number;
  selectedSize?: string;
  selectedColor?: { name: string; hex: string };
}

interface CartAnimationContextType {
  animateAddToCart: (options: AnimateAddOptions) => Promise<boolean>;
}

const CartAnimationContext = createContext<CartAnimationContextType | undefined>(undefined);

export const CartAnimationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { addToCart, addToast, cart } = useStore();
  const addToCartRef = useRef(addToCart);
  const addToastRef = useRef(addToast);
  const cartRef = useRef(cart);
  const reservationsRef = useRef(new Map<string, number>());

  useEffect(() => {
    addToCartRef.current = addToCart;
    addToastRef.current = addToast;
    cartRef.current = cart;
  }, [addToCart, addToast, cart]);

  const animateAddToCart = useCallback(async ({
    product,
    sourceElement,
    quantity = 1,
    selectedSize,
    selectedColor,
  }: AnimateAddOptions): Promise<boolean> => {
    if (product.stock <= 0) {
      addToastRef.current('Sorry, this product is currently out of stock.', 'error');
      return false;
    }

    const cartQuantity = cartRef.current
      .filter((item) => item.productId === product.id)
      .reduce((total, item) => total + item.quantity, 0);
    const reservedQuantity = reservationsRef.current.get(product.id) || 0;

    if (cartQuantity + reservedQuantity + quantity > product.stock) {
      addToastRef.current(
        `Cannot add more. Only ${product.stock} total units are available across all variants.`,
        'warning'
      );
      return false;
    }

    reservationsRef.current.set(product.id, reservedQuantity + quantity);
    let added = false;

    const commitToCart = () => {
      flushSync(() => {
        added = addToCartRef.current(product, quantity, selectedSize, selectedColor);
      });
    };

    try {
      if (!sourceElement) {
        commitToCart();
      } else {
        await flyProductToCart({
          source: sourceElement,
          imageUrl: product.images[0],
          productName: product.name,
          onImpact: commitToCart,
        });
      }
      return added;
    } catch (error) {
      // The commerce action must survive a cancelled/unsupported visual animation.
      if (!added) commitToCart();
      console.warn('Fly-to-cart animation was interrupted:', error);
      return added;
    } finally {
      const remaining = Math.max(
        0,
        (reservationsRef.current.get(product.id) || quantity) - quantity
      );
      if (remaining === 0) reservationsRef.current.delete(product.id);
      else reservationsRef.current.set(product.id, remaining);
    }
  }, []);

  return (
    <CartAnimationContext.Provider value={{ animateAddToCart }}>
      {children}
    </CartAnimationContext.Provider>
  );
};

export const useCartAnimation = () => {
  const context = useContext(CartAnimationContext);
  if (!context) {
    throw new Error('useCartAnimation must be used within a CartAnimationProvider');
  }
  return context;
};
