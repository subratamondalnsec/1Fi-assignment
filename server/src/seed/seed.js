import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import { Product } from '../models/Product.js';

const products = [
  {
    name: 'iPhone 17 Pro',
    slug: 'iphone-17-pro',
    description: 'Apple flagship smartphone with a pro-grade camera system and titanium design.',
    brand: 'Apple',
    category: 'smartphones',
    variants: [
      {
        name: '256GB Deep Blue', storage: '256GB', color: 'Deep Blue', mrp: 144900, price: 134900, imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=900&q=80', stock: 12,
        emiPlans: [
          { tenure: 6, monthlyAmount: 22483, interestRate: 0, cashback: 3000, description: 'No-cost EMI with ₹3,000 cashback.' },
          { tenure: 12, monthlyAmount: 11745, interestRate: 4.5, cashback: 5000, description: '12-month plan with enhanced cashback.' },
        ],
      },
      {
        name: '512GB Silver', storage: '512GB', color: 'Silver', mrp: 164900, price: 154900, imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=900&q=80', stock: 8,
        emiPlans: [
          { tenure: 6, monthlyAmount: 25817, interestRate: 0, cashback: 4000, description: 'No-cost EMI with ₹4,000 cashback.' },
          { tenure: 12, monthlyAmount: 13445, interestRate: 4.5, cashback: 6000, description: '12-month plan with enhanced cashback.' },
        ],
      },
    ],
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    description: 'Premium Android smartphone with Galaxy AI, S Pen, and a high-resolution camera.',
    brand: 'Samsung',
    category: 'smartphones',
    variants: [
      {
        name: '256GB Titanium Black', storage: '256GB', color: 'Titanium Black', mrp: 129999, price: 115999, imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=80', stock: 15,
        emiPlans: [
          { tenure: 6, monthlyAmount: 19333, interestRate: 0, cashback: 2500, description: 'No-cost EMI for six months.' },
          { tenure: 12, monthlyAmount: 10120, interestRate: 4.5, cashback: 4500, description: 'Extended EMI with cashback.' },
        ],
      },
      {
        name: '512GB Titanium Violet', storage: '512GB', color: 'Titanium Violet', mrp: 139999, price: 125999, imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=80', stock: 9,
        emiPlans: [
          { tenure: 6, monthlyAmount: 21000, interestRate: 0, cashback: 3000, description: 'No-cost EMI for six months.' },
          { tenure: 12, monthlyAmount: 10995, interestRate: 4.5, cashback: 5000, description: 'Extended EMI with cashback.' },
        ],
      },
    ],
  },
  {
    name: 'Google Pixel 9 Pro',
    slug: 'google-pixel-9-pro',
    description: 'Google smartphone featuring advanced computational photography and on-device AI.',
    brand: 'Google',
    category: 'smartphones',
    variants: [
      {
        name: '256GB Obsidian', storage: '256GB', color: 'Obsidian', mrp: 109999, price: 99999, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80', stock: 14,
        emiPlans: [
          { tenure: 6, monthlyAmount: 16667, interestRate: 0, cashback: 2000, description: 'No-cost EMI for six months.' },
          { tenure: 12, monthlyAmount: 8715, interestRate: 4.5, cashback: 4000, description: 'Extended EMI with cashback.' },
        ],
      },
      {
        name: '512GB Porcelain', storage: '512GB', color: 'Porcelain', mrp: 119999, price: 109999, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80', stock: 7,
        emiPlans: [
          { tenure: 6, monthlyAmount: 18333, interestRate: 0, cashback: 2500, description: 'No-cost EMI for six months.' },
          { tenure: 12, monthlyAmount: 9590, interestRate: 4.5, cashback: 4500, description: 'Extended EMI with cashback.' },
        ],
      },
    ],
  },
];

async function seed() {
  await connectDatabase();
  await Product.deleteMany({});
  const insertedProducts = await Product.insertMany(products);
  const variantCount = insertedProducts.reduce((total, product) => total + product.variants.length, 0);
  const emiPlanCount = insertedProducts.reduce((total, product) => total + product.variants.reduce((variantTotal, variant) => variantTotal + variant.emiPlans.length, 0), 0);
  console.log(`Seeded ${insertedProducts.length} products, ${variantCount} variants, and ${emiPlanCount} EMI plans.`);
}

seed()
  .catch((error) => { console.error('Product seed failed:', error); process.exitCode = 1; })
  .finally(async () => { await mongoose.disconnect(); });
