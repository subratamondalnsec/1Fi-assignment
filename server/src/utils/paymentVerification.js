import { createHmac, timingSafeEqual } from 'node:crypto';

export function verifyRazorpaySignature({ orderId, paymentId, signature, secret }) {
  if (typeof secret !== 'string' || !secret) {
    const error = new Error('Razorpay signature verification is not configured.');
    error.code = 'RAZORPAY_VERIFICATION_CONFIG_MISSING';
    throw error;
  }

  if (![orderId, paymentId, signature].every((value) => typeof value === 'string' && value)) return false;

  const payload = `${orderId}|${paymentId}`;
  const expectedSignature = createHmac('sha256', secret).update(payload).digest('hex');
  const expectedBuffer = Buffer.from(expectedSignature, 'hex');
  const suppliedBuffer = Buffer.from(signature, 'hex');

  // timingSafeEqual throws for differently sized buffers, so reject that case first.
  if (expectedBuffer.length !== suppliedBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, suppliedBuffer);
}
