'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { StaticImageData } from 'next/image'

export interface CartProduct {
  id: number | string
  originalProductId?: string
  product_id?: string
  name: string
  price: number
  image: string | StaticImageData
  description: string
  variant?: {
    size: string
    color: string
    price?: number
  }
}

interface CartItem extends CartProduct {
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: CartProduct, quantity?: number) => void
  removeFromCart: (productId: number | string) => void
  updateQuantity: (productId: number | string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartItemCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const getCartKey = () => {
  if (typeof window === 'undefined') return 'swiftree_cart';
  const match = window.location.pathname.match(/\/storefront\/([^/]+)/);
  return match ? `swiftree_cart_${match[1]}` : 'swiftree_cart';
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const key = getCartKey();
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to rehydrate cart:', e);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      const key = getCartKey();
      localStorage.setItem(key, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cart, hydrated]);

  const addToCart = (product: CartProduct, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);

      if (existingItem) {
        const newQty = existingItem.quantity + quantity;
        
        if (newQty <= 0) {
          return prevCart.filter(item => item.id !== product.id);
        }
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: newQty }
            : item
        );
      } else {
        if (quantity <= 0) return prevCart;
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: number | string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number | string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem(getCartKey());
    } catch (e) {
      console.error('Failed to clear cart from storage:', e);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}