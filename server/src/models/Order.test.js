import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { Order } from './Order.js';

const objectId = new mongoose.Types.ObjectId();
const validOrder = {
  orderNumber: '1FI-TEST-001',
  items: [{ productId: objectId, productName: 'Test phone', variantId: objectId, unitPrice: 100, quantity: 1, emiPlanId: objectId, emiTenure: 6, emiMonthlyAmount: 20, emiInterestRate: 0, emiCashback: 0 }],
  customer: { fullName: 'Test Customer', email: 'test@example.com', phone: '9999999999' },
  shippingAddress: { address: '1 Test Street', city: 'Test City', state: 'Test State', pincode: '123456' },
  subtotal: 100,
  platformFee: 0,
  deliveryFee: 0,
  totalAmount: 100,
  currency: 'INR',
  paymentMethod: 'razorpay',
  paymentStatus: 'paid',
  razorpayOrderId: 'order_test',
  razorpayPaymentId: 'pay_test',
};

assert.equal(new Order(validOrder).validateSync(), undefined);
assert.ok(new Order({ ...validOrder, items: [] }).validateSync().errors.items);
assert.ok(new Order({ ...validOrder, totalAmount: 0 }).validateSync().errors.totalAmount);
assert.ok(new Order({ ...validOrder, paymentStatus: 'pending' }).validateSync().errors.paymentStatus);
console.log('Order model validation tests passed.');