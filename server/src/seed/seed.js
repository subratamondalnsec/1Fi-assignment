import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import { Product } from '../models/Product.js';

const imageSets = {
  iphone: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1603921326210-6edd2d60ca68?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=85'],
  samsung: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1200&q=85'],
  pixel: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1200&q=85'],
  oneplus: ['https://images.unsplash.com/photo-1592286927505-2fd0b7e8a5e6?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1603921326210-6edd2d60ca68?auto=format&fit=crop&w=1200&q=85'],
  xiaomi: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=85'],
  vivo: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1603921326210-6edd2d60ca68?auto=format&fit=crop&w=1200&q=85'],
  nothing: ['https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=85'],
  motorola: ['https://images.unsplash.com/photo-1603921326210-6edd2d60ca68?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1200&q=85'],
  realme: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1200&q=85'],
};

function plans(monthlyAmount, cashback) {
  return [{ tenure: 6, monthlyAmount, interestRate: 0, cashback, description: 'No-cost EMI with cashback.' }, { tenure: 12, monthlyAmount: Math.round(monthlyAmount / 2 * 1.045), interestRate: 4.5, cashback: cashback + 1500, description: 'Extended EMI with enhanced cashback.' }];
}

function variant(storage, color, price, images, stock, cashback) {
  return { name: `${storage} ${color}`, storage, color, mrp: price + 10000, price, images, imageUrl: images[0], stock, emiPlans: plans(Math.round(price / 6), cashback) };
}

const products = [
  { name: 'iPhone 17 Pro', slug: 'iphone-17-pro', description: 'Apple flagship smartphone with a pro-grade camera system and titanium design.', brand: 'Apple', category: 'smartphones', variants: [variant('256GB', 'Deep Blue', 134900, imageSets.iphone, 12, 3000), variant('512GB', 'Silver', 154900, imageSets.iphone, 8, 4000)] },
  { name: 'Samsung Galaxy S24 Ultra', slug: 'samsung-galaxy-s24-ultra', description: 'Premium Android smartphone with Galaxy AI, S Pen, and a high-resolution camera.', brand: 'Samsung', category: 'smartphones', variants: [variant('256GB', 'Titanium Black', 115999, imageSets.samsung, 15, 2500), variant('512GB', 'Titanium Violet', 125999, imageSets.samsung, 9, 3000)] },
  { name: 'Google Pixel 9 Pro', slug: 'google-pixel-9-pro', description: 'Google smartphone featuring advanced computational photography and on-device AI.', brand: 'Google', category: 'smartphones', variants: [variant('256GB', 'Obsidian', 99999, imageSets.pixel, 14, 2000), variant('512GB', 'Porcelain', 109999, imageSets.pixel, 7, 2500)] },
  { name: 'OnePlus 13', slug: 'oneplus-13', description: 'A fast, refined flagship with a vivid display, Hasselblad camera system, and all-day battery.', brand: 'OnePlus', category: 'smartphones', variants: [variant('256GB', 'Midnight', 69999, imageSets.oneplus, 18, 1500), variant('512GB', 'Emerald', 76999, imageSets.oneplus, 11, 2000)] },
  { name: 'Xiaomi 15 Ultra', slug: 'xiaomi-15-ultra', description: 'Photography-first flagship with a Leica-inspired camera experience and premium performance.', brand: 'Xiaomi', category: 'smartphones', variants: [variant('256GB', 'Black', 89999, imageSets.xiaomi, 10, 2000), variant('512GB', 'White', 95999, imageSets.xiaomi, 6, 2500)] },
  { name: 'vivo X200 Pro', slug: 'vivo-x200-pro', description: 'A premium portrait flagship with ZEISS imaging and powerful performance.', brand: 'vivo', category: 'smartphones', variants: [variant('512GB', 'Titanium Gray', 94999, imageSets.vivo, 9, 2500), variant('512GB', 'Cosmos Black', 94999, imageSets.vivo.slice().reverse(), 7, 2500)] },
  { name: 'Nothing Phone (3)', slug: 'nothing-phone-3', description: 'Distinctive transparent design paired with a clean, intelligent smartphone experience.', brand: 'Nothing', category: 'smartphones', variants: [variant('256GB', 'White', 79999, imageSets.nothing, 13, 2000), variant('256GB', 'Black', 79999, imageSets.nothing.slice().reverse(), 10, 2000)] },
  { name: 'Motorola Edge 60 Pro', slug: 'motorola-edge-60-pro', description: 'A refined edge-to-edge flagship with a vivid display and versatile camera system.', brand: 'Motorola', category: 'smartphones', variants: [variant('256GB', 'Pantone Shadow', 59999, imageSets.motorola, 16, 1500), variant('256GB', 'Pantone Dazzling Blue', 59999, imageSets.motorola.slice().reverse(), 12, 1500)] },
  { name: 'realme GT 7 Pro', slug: 'realme-gt-7-pro', description: 'Performance-focused flagship built for fast gaming, imaging, and everyday speed.', brand: 'realme', category: 'smartphones', variants: [variant('256GB', 'Mars Orange', 69999, imageSets.realme, 14, 1800), variant('256GB', 'Galaxy Grey', 69999, imageSets.realme.slice().reverse(), 12, 1800), variant('512GB', 'Mars Orange', 75999, imageSets.realme, 8, 2200), variant('512GB', 'Galaxy Grey', 75999, imageSets.realme.slice().reverse(), 7, 2200)] },
];

async function seed() {
  await connectDatabase();
  await Product.deleteMany({});
  const insertedProducts = await Product.insertMany(products);
  const variantCount = insertedProducts.reduce((total, product) => total + product.variants.length, 0);
  const imageCount = insertedProducts.reduce((total, product) => total + product.variants.reduce((variantTotal, item) => variantTotal + item.images.length, 0), 0);
  console.log(`Seeded ${insertedProducts.length} products, ${variantCount} variants, and ${imageCount} product images.`);
}

seed().catch((error) => { console.error('Product seed failed:', error); process.exitCode = 1; }).finally(async () => { await mongoose.disconnect(); });
