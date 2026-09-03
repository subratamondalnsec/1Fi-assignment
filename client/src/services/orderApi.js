const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export async function createOrder(orderRequest) {
  const response = await fetch(`${apiBaseUrl}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderRequest),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.success || !payload.data?.id) throw new Error(payload.message || 'Order could not be created.');
  return payload.data;
}

export async function getOrder(orderId) {
  const response = await fetch(`${apiBaseUrl}/api/orders/${encodeURIComponent(orderId)}`);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.success || !payload.data?.id) throw new Error(payload.message || 'Order could not be loaded.');
  return payload.data;
}