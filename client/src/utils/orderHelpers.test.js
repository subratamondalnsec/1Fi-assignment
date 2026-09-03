import assert from 'node:assert/strict';
import { buildOrderRequest } from './orderHelpers.js';

const request = buildOrderRequest({
  items: [{ productId: 'product-1', variantId: 'variant-1', emiPlanId: 'plan-1', quantity: 2, price: 99999, monthlyPayment: 10 }],
  address: { fullName: 'Test Customer', phone: '9999999999', email: 'test@example.com', address: '1 Test Street', city: 'Test City', state: 'Test State', pincode: '123456' },
  payment: { razorpay_order_id: 'order_test', razorpay_payment_id: 'pay_test', razorpay_signature: 'signature_test' },
});

assert.deepEqual(request.items, [{ productId: 'product-1', variantId: 'variant-1', emiPlanId: 'plan-1', quantity: 2 }]);
assert.equal(request.razorpaySignature, 'signature_test');
assert.equal(request.currency, 'INR');
console.log('Order request helper tests passed.');