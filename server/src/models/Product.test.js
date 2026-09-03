import assert from 'node:assert/strict';
import { Product } from './Product.js';

const product = new Product({ name: 'Test phone', slug: 'test-phone', variants: [{ name: '256GB Silver', storage: '256GB', color: 'Silver', mrp: 100, price: 90, images: ['https://example.com/one.jpg', 'https://example.com/two.jpg', 'https://example.com/three.jpg'], emiPlans: [{ tenure: 6, monthlyAmount: 15, interestRate: 0 }] }] });
assert.equal(product.validateSync(), undefined);
assert.ok(new Product({ ...product.toObject(), variants: [{ ...product.variants[0].toObject(), images: ['not-a-url'] }] }).validateSync().errors['variants.0.images']);
assert.equal(new Product({ ...product.toObject(), variants: [{ ...product.variants[0].toObject(), images: [], imageUrl: 'https://example.com/legacy.jpg' }] }).validateSync(), undefined);
assert.ok(new Product({ ...product.toObject(), variants: [{ ...product.variants[0].toObject(), mrp: 80 }] }).validateSync().errors['variants.0.mrp']);
console.log('Product image validation tests passed.');