import { useEffect, useMemo, useState } from 'react';
import { CartContext } from './cartContext';
const cartStorageKey = 'onefi-cart';

function readCart() {
  try {
    const storedCart = window.localStorage.getItem(cartStorageKey);
    const parsedCart = storedCart ? JSON.parse(storedCart) : [];
    return Array.isArray(parsedCart) ? parsedCart.map((item) => ({ ...item, quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)) })) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);
  const [cartNotice, setCartNotice] = useState(null);

  useEffect(() => {
    window.localStorage.setItem(cartStorageKey, JSON.stringify(items));
  }, [items]);

  function addItem(item) {
    setItems((currentItems) => {
      const matchingItem = currentItems.find((currentItem) => currentItem.productId === item.productId && currentItem.variantId === item.variantId && currentItem.storage === item.storage && currentItem.color === item.color && currentItem.emiPlanId === item.emiPlanId);
      if (!matchingItem) return [...currentItems, item];
      const nextQuantity = Math.max(1, Number(matchingItem.quantity) || 1) + 1;
      return currentItems.map((currentItem) => currentItem.id === matchingItem.id ? { ...currentItem, quantity: nextQuantity } : currentItem);
    });
    setCartNotice('Added to cart');
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

  const value = useMemo(() => ({ items, addItem, updateQuantity, removeItem, clearCart, cartNotice, dismissCartNotice: () => setCartNotice(null) }), [items, cartNotice]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
