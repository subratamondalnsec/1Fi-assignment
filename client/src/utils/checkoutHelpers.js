import { calculateCartFirstPayment, calculateCartSubtotal } from './cartHelpers';

export const checkoutFields = ['fullName', 'phone', 'email', 'address', 'city', 'state', 'pincode'];

export function createEmptyAddress() {
  return { fullName: '', phone: '', email: '', address: '', city: '', state: '', pincode: '' };
}

export function validateAddress(address) {
  return checkoutFields.reduce((errors, field) => {
    if (!address[field]?.trim()) errors[field] = 'This field is required.';
    return errors;
  }, {});
}

export function getCheckoutSummary(items = []) {
  const subtotal = calculateCartSubtotal(items);
  const firstPayment = calculateCartFirstPayment(items);
  return {
    totalItems: items.reduce((total, item) => total + item.quantity, 0),
    subtotal,
    platformFee: 0,
    deliveryFee: 0,
    firstPayment,
    finalAmount: firstPayment,
  };
}
