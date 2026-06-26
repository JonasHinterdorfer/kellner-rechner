import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem } from '../types/types';

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, optionName: string) => void;
  incrementQuantity: (productId: string, optionName: string) => void;
  decrementQuantity: (productId: string, optionName: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getFoodCount: () => number;
  getDrinksCount: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    const existingItemIndex = cartItems.findIndex(
      i => i.productId === item.productId && i.selectedOption.name === item.selectedOption.name
    );

    if (existingItemIndex !== -1) {
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += item.quantity;
      setCartItems(updatedItems);
    } else {
      setCartItems([...cartItems, item]);
    }
  };

  const removeFromCart = (productId: string, optionName: string) => {
    setCartItems(cartItems.filter(
      item => !(item.productId === productId && item.selectedOption.name === optionName)
    ));
  };

  const incrementQuantity = (productId: string, optionName: string) => {
    setCartItems(
      cartItems.map(item =>
        item.productId === productId && item.selectedOption.name === optionName
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decrementQuantity = (productId: string, optionName: string) => {
    setCartItems(
      cartItems.map(item =>
        item.productId === productId && item.selectedOption.name === optionName
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.selectedOption.price * item.quantity,
      0
    );
  };

  const getFoodCount = () => {
    return cartItems
      .filter(item => item.category === 'food')
      .reduce((count, item) => count + item.quantity, 0);
  };

  const getDrinksCount = () => {
    return cartItems
      .filter(item => item.category === 'drinks')
      .reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
        clearCart,
        getTotalPrice,
        getFoodCount,
        getDrinksCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
