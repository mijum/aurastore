import assert from 'node:assert/strict';
import test from 'node:test';
import { orderInputSchema, productInputSchema } from '../server-dist/server/src/validation.js';

const customer = {
  fullName: 'Aura Customer', email: 'SHOPPER@EXAMPLE.COM', phone: '01712345678',
  streetAddress: '42 Test Road', area: 'Banani', city: 'Dhaka', district: 'Dhaka',
  postalCode: '1213', country: 'Bangladesh',
};

test('checkout accepts IDs and quantities but strips untrusted client prices', () => {
  const result = orderInputSchema.parse({ customer, items: [{ productId: 'product-1', quantity: 2, price: 1 }], deliveryMethod: 'standard', paymentMethod: 'cod' });
  assert.equal(result.customer.email, 'shopper@example.com');
  assert.equal('price' in result.items[0], false);
});

test('checkout rejects zero and negative quantities', () => {
  assert.equal(orderInputSchema.safeParse({ customer, items: [{ productId: 'product-1', quantity: 0 }], deliveryMethod: 'standard', paymentMethod: 'cod' }).success, false);
});

test('product validation requires a clean slug and at least one image', () => {
  const base = { name: 'Test Product', slug: 'test-product', sku: 'TEST-001', categoryId: 'category-1', description: 'A complete product description.', price: 100, stock: 5, images: [{ url: 'https://example.com/image.jpg', position: 0, isPrimary: true }] };
  assert.equal(productInputSchema.safeParse(base).success, true);
  assert.equal(productInputSchema.safeParse({ ...base, slug: 'Not Valid' }).success, false);
  assert.equal(productInputSchema.safeParse({ ...base, images: [] }).success, false);
});
