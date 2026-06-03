/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Product } from '../types/product';

// Тип для продукта в корзине

interface CartItem extends Product {
  quantity: number;
}

// Тип для элементов конетекста
interface CartContextType {
  cart: CartItem[];

  totalPrice: number;
  totalCount: number;
  clearCart: () => void;
  getItemQuantity: (id: string) => number;

  addToCart: (product: Product) => void;
  removeItemFromCart: (id: string) => void;
  increaseItem: (id: string) => void;
  decreaseItem: (id: string) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');

    if (!saved) return [];

    try {
      const parsed: unknown = JSON.parse(saved);

      if (!Array.isArray(parsed)) return [];

      return parsed.filter(isCartItem);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  const totalCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  const clearCart = () => setCart([]);

  const getItemQuantity = (id: string) => {
    return cart.find((item) => item.id === id)?.quantity ?? 0;
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => {
        return item.id === product.id;
      });

      if (existing) {
        return prev.map((item) => {
          return item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item;
        });
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeItemFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const increaseItem = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    );
  };

  const decreaseItem = (id: string) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          return item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item;
        })
        .filter((item) => {
          return item.quantity > 0;
        });
    });
  };

  return (
    <CartContext.Provider
      value={{
        totalPrice,
        totalCount,
        clearCart,
        getItemQuantity,
        cart,
        addToCart,
        removeItemFromCart,
        increaseItem,
        decreaseItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error('useCart must be used within <CartProvider>');
  }

  return ctx;
}

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const item = value as Partial<CartItem>;

  return (
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    typeof item.price === 'number' &&
    typeof item.imageUrl === 'string' &&
    typeof item.description === 'string' &&
    typeof item.category === 'string' &&
    typeof item.quantity === 'number'
  );
}
