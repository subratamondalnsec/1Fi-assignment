import assert from 'node:assert/strict';
import { resolveVariant } from '../../utils/variantResolver.js';

const variants = [
  { id: 'a', storage: '256GB', color: 'Silver' },
  { id: 'b', storage: '512GB', color: 'Silver' },
  { id: 'c', storage: '256GB', color: 'Black' },
];

assert.equal(resolveVariant(variants, variants[0], 'storage', '512GB').id, 'b');
assert.equal(resolveVariant(variants, variants[0], 'color', 'Black').id, 'c');
assert.equal(resolveVariant(variants, variants[1], 'color', 'Black').id, 'c');
console.log('Independent variant selection tests passed.');