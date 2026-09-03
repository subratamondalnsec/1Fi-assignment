export function toPaise(amountInRupees) {
  if (!Number.isFinite(amountInRupees) || amountInRupees <= 0) throw new RangeError('Amount must be a positive number of rupees.');

  // Razorpay accepts INR amounts in paise: ₹1,000 becomes 100,000 paise.
  const amountInPaise = Math.round(amountInRupees * 100);
  if (!Number.isSafeInteger(amountInPaise)) throw new RangeError('Amount is outside the supported range.');

  return amountInPaise;
}
