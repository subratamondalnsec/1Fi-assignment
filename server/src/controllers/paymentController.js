import { randomUUID } from 'node:crypto';
import { getRazorpayClient } from '../config/razorpay.js';
import { toPaise } from '../utils/money.js';
import { verifyRazorpaySignature } from '../utils/paymentVerification.js';
import { Product } from '../models/Product.js';

const supportedCurrencies = new Set(['INR']);

function createReceipt() {
  return `onefi-${Date.now()}-${randomUUID().slice(0, 8)}`;
}

export async function createOrder(request, response, next) {
  const { amount, items, currency: requestedCurrency } = request.body ?? {};
  let authoritativeAmount = amount;
  if (Array.isArray(items)) {
    const products = await Product.find({ _id: { $in: items.map((item) => item?.productId) } });
    const productsById = new Map(products.map((product) => [product._id.toString(), product]));
    authoritativeAmount = 0;
    for (const item of items) {
      const product = productsById.get(item?.productId);
      const variant = product?.variants.id(item?.variantId);
      const plan = variant?.emiPlans.id(item?.emiPlanId);
      const quantity = Number(item?.quantity);
      if (!product || !variant || !plan || !Number.isInteger(quantity) || quantity < 1) return response.status(400).json({ success: false, message: 'The selected financing plan is invalid.' });
      authoritativeAmount += plan.monthlyAmount * quantity;
    }
  }
  const amountInRupees = typeof authoritativeAmount === 'number' ? authoritativeAmount : Number(authoritativeAmount);
  const currency = typeof requestedCurrency === 'string' ? requestedCurrency.trim().toUpperCase() : 'INR';

  if (amount === undefined || amount === null || amount === '' || !Number.isFinite(amountInRupees) || amountInRupees <= 0) {
    return response.status(400).json({ success: false, message: 'Amount must be a positive numeric value in rupees.' });
  }

  if (!supportedCurrencies.has(currency)) {
    return response.status(400).json({ success: false, message: 'Unsupported currency. Only INR is supported.' });
  }

  let amountInPaise;
  try {
    amountInPaise = toPaise(amountInRupees);
  } catch (error) {
    return response.status(400).json({ success: false, message: error.message });
  }

  try {
    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({ amount: amountInPaise, currency, receipt: createReceipt() });
    return response.status(201).json({ success: true, data: { id: order.id, amount: order.amount, currency: order.currency, status: order.status } });
  } catch (error) {
    if (error.code === 'RAZORPAY_CONFIG_MISSING') {
      return response.status(503).json({ success: false, message: 'Payment service is not configured.' });
    }

    const paymentError = new Error('Unable to create a payment order.');
    paymentError.statusCode = 502;
    return next(paymentError);
  }
}

export function verifyPayment(request, response, next) {
  const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = request.body ?? {};

  if (![orderId, paymentId, signature].every((value) => typeof value === 'string' && value.trim())) {
    return response.status(400).json({ success: false, message: 'Payment verification failed' });
  }

  try {
    const verified = verifyRazorpaySignature({ orderId, paymentId, signature, secret: process.env.RAZORPAY_KEY_SECRET });
    if (!verified) return response.status(400).json({ success: false, message: 'Payment verification failed' });
    return response.status(200).json({ success: true, data: { verified: true } });
  } catch (error) {
    if (error.code === 'RAZORPAY_VERIFICATION_CONFIG_MISSING') {
      error.statusCode = 503;
      error.publicMessage = 'Payment service is not configured.';
    }
    return next(error);
  }
}
