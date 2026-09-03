const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const razorpayScriptId = 'razorpay-checkout-script';
let razorpayScriptPromise;

export async function createPaymentOrder({ amount, items, currency = 'INR' }) {
  const response = await fetch(`${apiBaseUrl}/api/payments/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, items, currency }),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !payload.success || !payload.data?.id) throw new Error('Payment order could not be created. Please try again.');
  return payload.data;
}

export async function verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
  const response = await fetch(`${apiBaseUrl}/api/payments/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ razorpay_order_id, razorpay_payment_id, razorpay_signature }),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !payload.success || payload.data?.verified !== true) throw new Error('Payment verification failed.');
  return payload.data;
}

export function loadRazorpayCheckout() {
  if (window.Razorpay) return Promise.resolve(window.Razorpay);
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(razorpayScriptId);
    const script = existingScript || document.createElement('script');

    function handleLoad() {
      if (window.Razorpay) resolve(window.Razorpay);
      else reject(new Error('Razorpay Checkout did not load.'));
    }

    function handleError() {
      reject(new Error('Razorpay Checkout could not be loaded.'));
    }

    script.addEventListener('load', handleLoad, { once: true });
    script.addEventListener('error', handleError, { once: true });

    if (!existingScript) {
      script.id = razorpayScriptId;
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }).catch((error) => {
    razorpayScriptPromise = undefined;
    throw error;
  });

  return razorpayScriptPromise;
}
