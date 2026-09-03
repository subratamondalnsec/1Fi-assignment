import mongoose from 'mongoose';
import { getRazorpayClient } from '../config/razorpay.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { verifyRazorpaySignature } from '../utils/paymentVerification.js';

const emptyPaymentMessage = 'A valid verified payment is required.';

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function publicOrder(order) {
  return { id: order._id.toString(), orderNumber: order.orderNumber, items: order.items, customer: order.customer, shippingAddress: order.shippingAddress, subtotal: order.subtotal, platformFee: order.platformFee, deliveryFee: order.deliveryFee, totalAmount: order.totalAmount, firstPaymentAmount: order.firstPaymentAmount, scheduledRepayment: order.scheduledRepayment, currency: order.currency, paymentMethod: order.paymentMethod, paymentStatus: order.paymentStatus, razorpayOrderId: order.razorpayOrderId, razorpayPaymentId: order.razorpayPaymentId, createdAt: order.createdAt };
}

function invalidRequest(message) {
  const error = new Error(message);
  error.statusCode = 400;
  error.publicMessage = message;
  return error;
}

function isTransactionUnsupported(error) {
  return error?.code === 20 || error?.code === 263 || /transaction numbers are only allowed|replica set|mongos/i.test(error?.message || '');
}

function validateCheckout(body) {
  const { items, customer, shippingAddress, razorpayOrderId, razorpayPaymentId, razorpaySignature, currency = 'INR' } = body ?? {};
  if (!Array.isArray(items) || !items.length) throw invalidRequest('Your cart is empty.');
  if (!isNonEmptyString(customer?.fullName) || !isNonEmptyString(customer?.email) || !isNonEmptyString(customer?.phone)) throw invalidRequest('Customer details are incomplete.');
  if (!shippingAddress || ['address', 'city', 'state', 'pincode'].some((field) => !isNonEmptyString(shippingAddress[field]))) throw invalidRequest('Shipping address is incomplete.');
  if (currency !== 'INR') throw invalidRequest('Unsupported currency. Only INR is supported.');
  if (![razorpayOrderId, razorpayPaymentId, razorpaySignature].every(isNonEmptyString)) throw invalidRequest(emptyPaymentMessage);
  return { items, customer, shippingAddress, razorpayOrderId, razorpayPaymentId, razorpaySignature, currency };
}

async function reconstructItems(items) {
  const productIds = [...new Set(items.map((item) => item?.productId))];
  if (productIds.some((id) => !mongoose.isValidObjectId(id))) throw invalidRequest('One or more cart items are invalid.');
  const products = await Product.find({ _id: { $in: productIds } });
  const productsById = new Map(products.map((product) => [product._id.toString(), product]));
  const stockUpdates = [];
  const snapshots = [];

  for (const item of items) {
    const product = productsById.get(item?.productId);
    const quantity = Number(item?.quantity);
    if (!product || !mongoose.isValidObjectId(item?.variantId) || !mongoose.isValidObjectId(item?.emiPlanId) || !Number.isInteger(quantity) || quantity < 1) throw invalidRequest('One or more cart items are invalid.');
    const variant = product.variants.id(item.variantId);
    const emiPlan = variant?.emiPlans.id(item.emiPlanId);
    if (!variant || !emiPlan) throw invalidRequest('A selected product variant or EMI plan is no longer available.');
    if (variant.stock < quantity) throw invalidRequest(`Insufficient stock for ${product.name}.`);
    stockUpdates.push({ productId: product._id, variantId: variant._id, quantity });
    const nextDueDate = new Date();
    nextDueDate.setMonth(nextDueDate.getMonth() + 1);
    snapshots.push({ productId: product._id, productName: product.name, variantId: variant._id, variantName: variant.name, storage: variant.storage, color: variant.color, imageUrl: variant.imageUrl, unitPrice: variant.price, quantity, emiPlanId: emiPlan._id, emiTenure: emiPlan.tenure, emiMonthlyAmount: emiPlan.monthlyAmount, emiInterestRate: emiPlan.interestRate, emiCashback: emiPlan.cashback, firstPaymentAmount: emiPlan.monthlyAmount, nextDueDate });
  }
  return { snapshots, stockUpdates };
}

function calculateTotals(items) {
  const subtotal = items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  const platformFee = 0;
  const deliveryFee = 0;
  const totalAmount = items.reduce((total, item) => total + item.firstPaymentAmount * item.quantity, 0) + platformFee + deliveryFee;
  const scheduledRepayment = items.reduce((total, item) => total + item.emiMonthlyAmount * item.emiTenure * item.quantity, 0);
  if (!Number.isFinite(subtotal) || !Number.isFinite(totalAmount) || totalAmount <= 0) throw invalidRequest('The order total is invalid.');
  return { subtotal, platformFee, deliveryFee, totalAmount, firstPaymentAmount: totalAmount, scheduledRepayment };
}

async function decrementStock(productId, variantId, quantity, options = {}) {
  const result = await Product.updateOne({ _id: productId, 'variants._id': variantId, 'variants.stock': { $gte: quantity } }, { $inc: { 'variants.$.stock': -quantity } }, options);
  if (result.modifiedCount !== 1) throw invalidRequest('Insufficient stock for one or more items.');
}

async function createWithTransaction(orderData, stockUpdates) {
  const session = await mongoose.startSession();
  try {
    let createdOrder;
    await session.withTransaction(async () => {
      for (const update of stockUpdates) await decrementStock(update.productId, update.variantId, update.quantity, { session });
      [createdOrder] = await Order.create([orderData], { session });
    });
    return createdOrder;
  } finally {
    await session.endSession();
  }
}

async function createWithoutTransaction(orderData, stockUpdates) {
  const updated = [];
  try {
    for (const update of stockUpdates) {
      await decrementStock(update.productId, update.variantId, update.quantity);
      updated.push(update);
    }
    return await Order.create(orderData);
  } catch (error) {
    await Promise.all(updated.map((update) => Product.updateOne({ _id: update.productId, 'variants._id': update.variantId }, { $inc: { 'variants.$.stock': update.quantity } })));
    throw error;
  }
}

export async function createOrder(request, response, next) {
  try {
    const checkout = validateCheckout(request.body);
    const verified = verifyRazorpaySignature({ orderId: checkout.razorpayOrderId, paymentId: checkout.razorpayPaymentId, signature: checkout.razorpaySignature, secret: process.env.RAZORPAY_KEY_SECRET });
    if (!verified) return response.status(400).json({ success: false, message: emptyPaymentMessage });

    const existingOrder = await Order.findOne({ razorpayPaymentId: checkout.razorpayPaymentId });
    if (existingOrder) return response.status(200).json({ success: true, data: publicOrder(existingOrder), duplicate: true });

    const razorpayOrder = await getRazorpayClient().orders.fetch(checkout.razorpayOrderId);
    const { snapshots, stockUpdates } = await reconstructItems(checkout.items);
    const totals = calculateTotals(snapshots);
    if (razorpayOrder.id !== checkout.razorpayOrderId || razorpayOrder.currency !== checkout.currency || Number(razorpayOrder.amount) !== Math.round(totals.totalAmount * 100)) return response.status(400).json({ success: false, message: 'Payment amount or currency does not match the order.' });

    const orderData = { orderNumber: `1FI-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, items: snapshots, customer: checkout.customer, shippingAddress: checkout.shippingAddress, ...totals, currency: checkout.currency, paymentMethod: 'razorpay', paymentStatus: 'paid', razorpayOrderId: checkout.razorpayOrderId, razorpayPaymentId: checkout.razorpayPaymentId };
    let order;
    try {
      order = await createWithTransaction(orderData, stockUpdates);
    } catch (error) {
      if (!isTransactionUnsupported(error)) throw error;
      order = await createWithoutTransaction(orderData, stockUpdates);
    }
    return response.status(201).json({ success: true, data: publicOrder(order) });
  } catch (error) {
    if (error.code === 'RAZORPAY_VERIFICATION_CONFIG_MISSING' || error.code === 'RAZORPAY_CONFIG_MISSING') {
      error.statusCode = 503;
      error.publicMessage = 'Payment service is not configured.';
    }
    if (error.code === 11000 && error.keyPattern?.razorpayPaymentId) {
      const existingOrder = await Order.findOne({ razorpayPaymentId: request.body?.razorpayPaymentId });
      if (existingOrder) return response.status(200).json({ success: true, data: publicOrder(existingOrder), duplicate: true });
    }
    return next(error);
  }
}

export async function getOrderById(request, response, next) {
  try {
    if (!mongoose.isValidObjectId(request.params.id)) return response.status(404).json({ success: false, message: 'Order not found.' });
    const order = await Order.findById(request.params.id).select('-__v');
    if (!order) return response.status(404).json({ success: false, message: 'Order not found.' });
    return response.status(200).json({ success: true, data: publicOrder(order) });
  } catch (error) {
    return next(error);
  }
}