export function getMinimumVariantPrice(variants = []) {
  const prices = variants.map((variant) => variant.price).filter((price) => Number.isFinite(price));
  return prices.length ? Math.min(...prices) : null;
}

export function getMinimumVariantMrp(variants = []) {
  const mrps = variants.map((variant) => variant.mrp).filter((mrp) => Number.isFinite(mrp));
  return mrps.length ? Math.min(...mrps) : null;
}

export function getDiscountPercentage(mrp, price) {
  if (!Number.isFinite(mrp) || !Number.isFinite(price) || mrp <= price) return null;
  return Math.round(((mrp - price) / mrp) * 100);
}

export function getMinimumEmi(variants = []) {
  const monthlyAmounts = variants.flatMap((variant) => (variant.emiPlans || []).map((plan) => plan.monthlyAmount)).filter((amount) => Number.isFinite(amount));
  return monthlyAmounts.length ? Math.min(...monthlyAmounts) : null;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}
