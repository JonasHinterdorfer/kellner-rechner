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
  // Table state
  tableItems: CartItem[];
  isTableActive: boolean;
  setTableActive: (active: boolean) => void;
  addToTable: (item: CartItem) => void;
  clearTable: () => void;
  getTableTotalPrice: () => number;
  getTableFoodCount: () => number;
  getTableDrinksCount: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [tableItems, setTableItems] = useState<CartItem[]>([]);
  const [isTableActive, setIsTableActive] = useState(false); // table inactive by default

  const mergeItem = (items: CartItem[], item: CartItem): CartItem[] => {
    const existingItemIndex = items.findIndex(
      i => i.productId === item.productId && i.selectedOption.name === item.selectedOption.name
    );

    if (existingItemIndex !== -1) {
      const updatedItems = [...items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + item.quantity
      };
      return updatedItems;
    }
    return [...items, item];
  };

  const addToCart = (item: CartItem) => {
    setCartItems(prev => mergeItem(prev, item));
    if (isTableActive) {
      setTableItems(prev => mergeItem(prev, item));
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

  // Table helpers
  const setTableActive = (active: boolean) => {
    if (active && !isTableActive) {
      // Wenn Tisch aktiviert wird, übernehme aktuellen Warenkorb
      setTableItems(prev => {
        let merged = [...prev];
        for (const item of cartItems) {
          merged = mergeItem(merged, item);
        }
        return merged;
      });
    } else if (!active && isTableActive) {
      // Wenn Tisch deaktiviert wird, leere den Tisch
      setTableItems([]);
    }
    setIsTableActive(active);
  };

  const addToTable = (item: CartItem) => {
    setTableItems(prev => mergeItem(prev, item));
  };

  const clearTable = () => {
    setTableItems([]);
  };

  const getTableTotalPrice = () => {
    return tableItems.reduce(
      (total, item) => total + item.selectedOption.price * item.quantity,
      0
    );
  };

  const getTableFoodCount = () => {
    return tableItems
      .filter(item => item.category === 'food')
      .reduce((count, item) => count + item.quantity, 0);
  };

  const getTableDrinksCount = () => {
    return tableItems
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
        getDrinksCount,
        tableItems,
        isTableActive,
        setTableActive,
        addToTable,
        clearTable,
        getTableTotalPrice,
        getTableFoodCount,
        getTableDrinksCount
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
