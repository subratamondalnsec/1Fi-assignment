const storageKey = 'onefi-order-ids';

export function rememberOrderId(orderId) {
  if (!orderId) return;
  try { const ids = getRememberedOrderIds().filter((id) => id !== orderId); window.localStorage.setItem(storageKey, JSON.stringify([orderId, ...ids])); } catch { /* demo history remains unavailable when storage is blocked */ }
}

export function getRememberedOrderIds() {
  try { const parsed = JSON.parse(window.localStorage.getItem(storageKey) || '[]'); return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : []; } catch { return []; }
}
