export function createCartItemKey({ productId, variantId, emiPlanId }) {
  return `${productId}:${variantId}:${emiPlanId}`;
}

export function buildCartItem(product, variant, emiPlan) {
  const emiPlanBelongsToVariant = Array.isArray(variant?.emiPlans) && variant.emiPlans.some((plan) => plan.id === emiPlan?.id);

  if (!product?.id || !variant?.id || !emiPlan?.id || !emiPlanBelongsToVariant) {
    throw new Error('Select a valid EMI plan for this variant before adding it to cart.');
  }

  return {
    id: createCartItemKey({ productId: product.id, variantId: variant.id, emiPlanId: emiPlan.id }),
    productId: product.id,
    productName: product.name,
    variantId: variant.id,
    variantName: variant.name,
    storage: variant.storage,
    color: variant.color,
    imageUrl: variant.imageUrl,
    images: variant.images,
    price: variant.price,
    mrp: variant.mrp,
    quantity: 1,
    emiPlanId: emiPlan.id,
    emiTenure: emiPlan.tenure,
    monthlyPayment: emiPlan.monthlyAmount,
    interestRate: emiPlan.interestRate,
    cashback: emiPlan.cashback,
    firstPaymentAmount: emiPlan.monthlyAmount,
  };
}

export function calculateCartSubtotal(items = []) {
  return items.reduce((total, item) => total + (Number.isFinite(item.price) ? item.price * item.quantity : 0), 0);
}

export function calculateCartFirstPayment(items = []) {
  return items.reduce((total, item) => total + (Number.isFinite(item.monthlyPayment) ? item.monthlyPayment * item.quantity : 0), 0);
}
