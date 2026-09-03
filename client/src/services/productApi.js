const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

function createApiError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

export async function fetchProducts({ signal } = {}) {
  const response = await fetch(`${apiBaseUrl}/api/products`, { signal });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || 'Products could not be loaded.');
  }

  return Array.isArray(payload.data) ? payload.data : [];
}

export async function fetchProductBySlug(slug, { signal } = {}) {
  const response = await fetch(`${apiBaseUrl}/api/products/${encodeURIComponent(slug)}`, { signal });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !payload.success) {
    throw createApiError(payload.message || 'Product could not be loaded.', response.status);
  }

  if (!payload.data || typeof payload.data !== 'object' || Array.isArray(payload.data) || !Array.isArray(payload.data.variants) || payload.data.variants.length === 0) {
    throw createApiError('The product response was not in the expected format.', response.status);
  }

  return payload.data;
}
