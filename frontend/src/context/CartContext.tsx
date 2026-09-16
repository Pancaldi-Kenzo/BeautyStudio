import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('beauty_studio_cart');
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (e) {
        console.error("Erreur de lecture du localStorage", e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('beauty_studio_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
    setCartItems((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === newItem.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...newItem, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('beauty_studio_cart');
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}