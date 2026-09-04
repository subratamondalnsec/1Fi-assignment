import assert from 'node:assert/strict';
import { getVariantByStorageAndColor, isCombinationAvailable } from '../../utils/variantResolver.js';

const variants = [
  { id: 'a', storage: '256GB', color: 'Silver' },
  { id: 'b', storage: '512GB', color: 'Silver' },
  { id: 'c', storage: '256GB', color: 'Black' },
];

// Test exact storage+color combination resolution
assert.equal(getVariantByStorageAndColor(variants, '512GB', 'Silver').id, 'b');
assert.equal(getVariantByStorageAndColor(variants, '256GB', 'Black').id, 'c');
assert.equal(getVariantByStorageAndColor(variants, '256GB', 'Silver').id, 'a');

// Test unavailable combinations return null
assert.equal(getVariantByStorageAndColor(variants, '512GB', 'Black'), null);

// Test availability checking
assert.equal(isCombinationAvailable(variants, '256GB', 'Silver'), true);
assert.equal(isCombinationAvailable(variants, '512GB', 'Black'), false);

console.log('Independent variant selection tests passed.');