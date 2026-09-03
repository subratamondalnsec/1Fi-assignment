export function resolveVariant(variants, selectedVariant, attribute, value) {
  const exactMatch = variants.find((variant) => variant[attribute] === value && variant.storage === selectedVariant?.storage && variant.color === selectedVariant?.color);
  return exactMatch || variants.find((variant) => variant[attribute] === value) || variants[0];
}