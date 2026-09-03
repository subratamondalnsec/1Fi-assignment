import { useEffect, useMemo, useState } from 'react';
import { CartContext } from './cartContext';
const cartStorageKey = 'onefi-cart';

function readCart() {
  try {
    const storedCart = window.localStorage.getItem(cartStorageKey);
    const parsedCart = storedCart ? JSON.parse(storedCart) : [];
    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);

  useEffect(() => {
    window.localStorage.setItem(cartStorageKey, JSON.stringify(items));
  }, [items]);

  function addItem(item) {
    setItems((currentItems) => {
      const matchingItem = currentItems.find((currentItem) => currentItem.id === item.id);
      if (!matchingItem) return [...currentItems, item];
      return currentItems.map((currentItem) => currentItem.id === item.id ? { ...currentItem, quantity: currentItem.quantity + 1 } : currentItem);
    });
  }

  function updateQuantity(itemId, quantity) {
    const nextQuantity = Math.floor(Number(quantity));
    setItems((currentItems) => nextQuantity > 0 ? currentItems.map((item) => item.id === itemId ? { ...item, quantity: nextQuantity } : item) : currentItems.filter((item) => item.id !== itemId));
  }

  function removeItem(itemId) {
    setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
  }

  function clearCart() {
    setItems([]);
  }

  const value = useMemo(() => ({ items, addItem, updateQuantity, removeItem, clearCart }), [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
