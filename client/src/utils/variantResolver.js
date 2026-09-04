/**
 * Get a variant by exact storage and color combination.
 * Returns null if the combination doesn't exist.
 * Never mutates either dimension silently.
 */
export function getVariantByStorageAndColor(variants, storage, color) {
  return variants.find(
    (variant) =>
      variant.storage === storage &&
      variant.color === color
  ) || null;
}

/**
 * Resolve a variant when one dimension changes, keeping the other constant.
 * If the new combination doesn't exist, returns null.
 * Does NOT fall back to any random variant.
 */
export function resolveVariant(variants, storage, color) {
  return getVariantByStorageAndColor(variants, storage, color);
}

/**
 * Get all available storage values.
 */
export function getAvailableStorages(variants) {
  return [...new Set(variants.map((v) => v.storage).filter(Boolean))];
}

/**
 * Get all available colors.
 */
export function getAvailableColors(variants) {
  return [...new Set(variants.map((v) => v.color).filter(Boolean))];
}

/**
 * Get colors available for a specific storage.
 */
export function getColorsForStorage(variants, storage) {
  return [...new Set(variants.filter((v) => v.storage === storage).map((v) => v.color).filter(Boolean))];
}

/**
 * Get storages available for a specific color.
 */
export function getStoragesForColor(variants, color) {
  return [...new Set(variants.filter((v) => v.color === color).map((v) => v.storage).filter(Boolean))];
}

/**
 * Check if a storage+color combination exists.
 */
export function isCombinationAvailable(variants, storage, color) {
  return variants.some((v) => v.storage === storage && v.color === color);
}