import { randomUUID } from 'node:crypto';
import { getRazorpayClient } from '../config/razorpay.js';
import { toPaise } from '../utils/money.js';

const supportedCurrencies = new Set(['INR']);

function createReceipt() {
  return `onefi-${Date.now()}-${randomUUID().slice(0, 8)}`;
}

export async function createOrder(request, response, next) {
  const { amount, currency: requestedCurrency } = request.body ?? {};
  const amountInRupees = typeof amount === 'number' ? amount : Number(amount);
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
