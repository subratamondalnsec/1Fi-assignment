import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { verifyRazorpaySignature } from './paymentVerification.js';

const secret = 'test_secret_only_for_deterministic_verification';
const orderId = 'order_test_123';
const paymentId = 'pay_test_456';
const signature = createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
const differentSignature = `${signature[0] === 'a' ? 'b' : 'a'}${signature.slice(1)}`;

assert.equal(verifyRazorpaySignature({ orderId, paymentId, signature, secret }), true);
assert.equal(verifyRazorpaySignature({ orderId, paymentId, signature: differentSignature, secret }), false);
assert.equal(verifyRazorpaySignature({ orderId: `${orderId}-changed`, paymentId, signature, secret }), false);
assert.equal(verifyRazorpaySignature({ orderId, paymentId: `${paymentId}-changed`, signature, secret }), false);
assert.equal(verifyRazorpaySignature({ orderId, paymentId, signature: '', secret }), false);
assert.equal(verifyRazorpaySignature({ orderId, paymentId, signature, secret: 'different_test_secret' }), false);
assert.doesNotThrow(() => verifyRazorpaySignature({ orderId, paymentId, signature: differentSignature, secret }));
assert.doesNotThrow(() => verifyRazorpaySignature({ orderId, paymentId, signature: 'short', secret }));

console.log('Payment signature verification tests passed.');
