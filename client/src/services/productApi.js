const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export async function fetchProducts({ signal } = {}) {
  const response = await fetch(`${apiBaseUrl}/api/products`, { signal });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || 'Products could not be loaded.');
  }

  return Array.isArray(payload.data) ? payload.data : [];
}
