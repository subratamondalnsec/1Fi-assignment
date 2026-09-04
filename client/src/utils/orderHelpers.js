export function buildOrderRequest({ items, address, payment }) {
  return {
    items: items.map(({ productId, variantId, emiPlanId, quantity }) => ({
      productId,
      variantId,
      emiPlanId,
      quantity,
    })),
    customer: {
      fullName: address.fullName,
      phone: address.phone,
      email: address.email,
    },
    shippingAddress: {
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    },
    razorpayOrderId: payment.razorpay_order_id,
    razorpayPaymentId: payment.razorpay_payment_id,
    razorpaySignature: payment.razorpay_signature,
    currency: "INR",
  };
}
