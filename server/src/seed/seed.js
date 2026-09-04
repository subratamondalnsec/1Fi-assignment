import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import { Product } from '../models/Product.js';

// Color-specific image sets from user-provided URLs
const coloredImageSets = {
  // iPhone 17 Pro
  'iphone-orange': [
    'https://images.unsplash.com/photo-1757709608566-4b9fd41a7af5?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1770238586572-3f3887b0dfd6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D',
    'https://images.unsplash.com/photo-1758348844306-5a0ba556db03?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDZ8fHxlbnwwfHx8fHw%3D',
  ],
  'iphone-silver': [
    'https://images.unsplash.com/photo-1758745175160-3ff94c3da514?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDd8fHxlbnwwfHx8fHw%3D',
    'https://images.unsplash.com/photo-1762769173933-7ce178a5bc10?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDUxfHx8ZW58MHx8fHx8',
    'https://images.unsplash.com/photo-1762769159527-a587ba9e4840?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDYxfHx8ZW58MHx8fHx8',
  ],
  // Samsung Galaxy S24 Ultra
  'samsung-silver': [
    'https://images.unsplash.com/photo-1738830234395-a351829a1c7b?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8U2Ftc3VuZyUyMEdhbGF4eSUyMHMyNCUyMFVsdHJhJTIwcGhvbmV8ZW58MHx8MHx8fDA%3D',
    'https://images.unsplash.com/photo-1738830223726-151adcd58131?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8U2Ftc3VuZyUyMEdhbGF4eSUyMHMyNCUyMFVsdHJhJTIwcGhvbmV8ZW58MHx8MHx8fDA%3D',
  ],
  'samsung-green': [
    'https://images.unsplash.com/photo-1705585175110-d25f92c183aa?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fFNhbXN1bmclMjBHYWxheHklMjBzMjQlMjBVbHRyYSUyMHBob25lfGVufDB8fDB8fHww',
    'https://images.unsplash.com/photo-1678958274412-563119ec18ab?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fFNhbXN1bmclMjBHYWxheHklMjBzMjQlMjBVbHRyYSUyMHBob25lfGVufDB8fDB8fHww',
    'https://images.unsplash.com/photo-1738830274216-20f63b8a0c02?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8U2Ftc3VuZyUyMEdhbGF4eSUyMHMyNCUyMFVsdHJhJTIwcGhvbmV8ZW58MHx8MHx8fDA%3D',
  ],
  // Google Pixel 9 Pro
  'pixel-black': [
    'https://images.unsplash.com/photo-1724322535079-11b08f7f5c88?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8R29vZ2xlJTIwUGl4ZWwlMjA5JTIwUHJvfGVufDB8fDB8fHww',
    'https://images.unsplash.com/photo-1724322637761-1fef6ca8c8b3?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8R29vZ2xlJTIwUHJvfGVufDB8fDB8fHww',
  ],
  'pixel-white': [
    'https://images.unsplash.com/photo-1727132528000-e314635a0d0b?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fEdvb2dsZSUyMFBpeGVsJTIwOSUyMFByb3xlbnwwfHwwfHx8MA%3D%3D',
    'https://images.unsplash.com/photo-1756517313520-c6c25364ce65?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Bnx8R29vZ2xlJTIwUGl4ZWwlMjA5JTIwUHJvfGVufDB8fDB8fHww',
  ],
  // OnePlus 13
  'oneplus-black': [
    'https://images.unsplash.com/photo-1757847505239-ce2fb51da67d?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8T25lUGx1cyUyMDEzfGVufDB8fDB8fHww',
    'https://images.unsplash.com/photo-1603129468615-8e7831c49f12?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fE9uZVBsdXMlMjAxM3xlbnwwfHwwfHx8MA%3D%3D',
  ],
  'oneplus-white': [
    'https://images.unsplash.com/photo-1773293915418-fb03a80120a7?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fE9uZVBsdXMlMjAxM3xlbnwwfHwwfHx8MA%3D%3D',
    'https://images.unsplash.com/photo-1772947793009-855264c693b8?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fE9uZVBsdXMlMjAxM3xlbnwwfHwwfHx8MA%3D%3D',
  ],
  // Xiaomi 15 Ultra
  'xiaomi-black': [
    'https://images.unsplash.com/photo-1774070150555-986bb534e975?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8WGlhb21pJTIwMTUlMjBVbHRyYXxlbnwwfHwwfHx8MA%3D%3D',
    'https://images.unsplash.com/photo-1774070150575-719b13072230?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8WGlhb21pJTIwMTUlMjBVbHRyYXxlbnwwfHwwfHx8MA%3D%3D',
  ],
  'xiaomi-white': [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTrMEnoXFsXz0gdMt3ucBiwnyOvYi1qFuXY8GJysfPYg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6U4kONWjl8vNAY5Vx-mlcetBh0B6LcUEkNUn_04z36g&s=10',
  ],
  // Vivo X200 Pro
  'vivo-blue': [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYgTaM9xnfgb45q-TCsYMCe4qyOF_kuFfmhUx-BA5fPw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRa_vit8N5bi4DicuCSU_f3QK_Xxspg1I8Sn5ipN5sCQ&s=10',
  ],
  'vivo-silver': [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR37vPoqutSJkLc-1eZ012jTVH4Ao32sRx4PxtFuNiIbA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmi_Evo9iVddqXUnhnM8D8EnvwjpTUhQPPy-fZiMnYVQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUxGyN-JbMKpjRJ9H8CCJOv0fdYkbQpZ8JfxlyAVFY8A&s=10',
  ],
  // Nothing Phone (3)
  'nothing-white': [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFDZvL2qFNpnSrWjeorGN8WZHYHXrdRTHe5WbfI2ti6Q&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvLQu7TVlknqUTYpAFwRg46lnIHBTByoeE6XvJzLAicQ&s=10',
  ],
  'nothing-black': [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTICgcj8FzB5G-oDKh1A0OtrOzShyC_UTT712dXm4v46Q&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4X21s7CBo6vbVKs8p4Y7wL5jJsCMRv4m-okO859V_PQ&s=10',
  ],
  // Motorola Edge 60 Pro
  'motorola-purple': [
    'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQfwEvzY56nNyh-XlbZKZBinlGzyvmendCJXx2pvl_DUinNgb1sv3GBX9b0Hqv3qLnJ47WbKfK-s26pTrSk33HU66JQotNaq0fwZiS2DtoP_v3hDsHqh_KqeK2x3asjHcrsYAp4noQ&usqp=CAc',
  ],
  'motorola-sky': [
    'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcT5xdO7Wg6A452S496HcEDirSvbUppM3HpFeOwVfmVqjwVdXeWzQKQcqq0y1-ez6OQRidn3fg3OOraPFvX2qOFTmriA4tiM6kZgAlYN-jxudbeOV5B-F2u2J2jmmcSc70wzXo-3lUk&usqp=CAc',
  ],
  // Realme GT 7 Pro
  'realme-black': [
    'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRtC7xvvemwBDQHGlIrKLU88yEBDOX9dGjWYayln1PBPai9IMuqxHXu-rHjW8vIbvnS-7VF6Bdaw7QjRB97t0mSQkWxWGD2oqS5EO0y62k&usqp=CAc',
  ],
  'realme-blue': [
    'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSG4w_vhxdMhisJY70IjpDHo1E0cdt7AC90crOA3ravw3uV1loitBOMWE0P-usz2jSSXd2uvmo0uQmIri0hA6jIyjCmnvRmPSuB8z5QcnbpUR8iKYlPOYkCqnVutRAWFA&usqp=CAc',
  ],
};

function plans(price, cashback, explicitAmounts = {}) {
  const terms = [3, 6, 12, 24, 36, 48, 60];
  return terms.map((tenure) => {
    const interestRate = tenure >= 36 ? 10.5 : 0;
    const monthlyAmount = explicitAmounts[tenure] || (interestRate === 0 ? Math.round(price / tenure) : Math.round((price * (interestRate / 1200) * (1 + interestRate / 1200) ** tenure) / ((1 + interestRate / 1200) ** tenure - 1)));
    return { tenure, monthlyAmount, interestRate, cashback: cashback + (tenure >= 12 ? 1000 : 0), description: interestRate === 0 ? 'Illustrative no-cost EMI plan.' : 'Illustrative reducing-balance EMI plan.' };
  });
}

function variant(storage, color, price, images, stock, cashback, explicitAmounts) {
  return { name: `${storage} ${color}`, storage, color, mrp: price + 10000, price, images, imageUrl: images[0], stock, emiPlans: plans(price, cashback, explicitAmounts) };
}

function colorVariants(storagePrices, colorImages, stock, cashback) {
  return storagePrices.flatMap(({ storage, price }) => Object.entries(colorImages).map(([color, images]) => variant(storage, color, price, images, stock[storage]?.[color] ?? 10, cashback[storage] ?? 0)));
}

const products = [
  { name: 'iPhone 17 Pro', slug: 'iphone-17-pro', description: 'Apple flagship smartphone with a pro-grade camera system and titanium design.', brand: 'Apple', category: 'smartphones', variants: colorVariants([{ storage: '256GB', price: 134900 }, { storage: '512GB', price: 154900 }], { Orange: coloredImageSets['iphone-orange'], Silver: coloredImageSets['iphone-silver'] }, { '256GB': { Orange: 12, Silver: 11 }, '512GB': { Orange: 9, Silver: 8 } }, { '256GB': 3000, '512GB': 4000 }) },
  { name: 'Samsung Galaxy S24 Ultra', slug: 'samsung-galaxy-s24-ultra', description: 'Premium Android smartphone with Galaxy AI, S Pen, and a high-resolution camera.', brand: 'Samsung', category: 'smartphones', variants: colorVariants([{ storage: '256GB', price: 115999 }, { storage: '512GB', price: 125999 }], { Silver: coloredImageSets['samsung-silver'], Green: coloredImageSets['samsung-green'] }, { '256GB': { Silver: 15, Green: 13 }, '512GB': { Silver: 10, Green: 9 } }, { '256GB': 2500, '512GB': 3000 }) },
  { name: 'Google Pixel 9 Pro', slug: 'google-pixel-9-pro', description: 'Google smartphone featuring advanced computational photography and on-device AI.', brand: 'Google', category: 'smartphones', variants: colorVariants([{ storage: '256GB', price: 99999 }, { storage: '512GB', price: 109999 }], { Black: coloredImageSets['pixel-black'], White: coloredImageSets['pixel-white'] }, { '256GB': { Black: 14, White: 12 }, '512GB': { Black: 9, White: 7 } }, { '256GB': 2000, '512GB': 2500 }) },
  { name: 'OnePlus 13', slug: 'oneplus-13', description: 'A fast, refined flagship with a vivid display, Hasselblad camera system, and all-day battery.', brand: 'OnePlus', category: 'smartphones', variants: colorVariants([{ storage: '256GB', price: 69999 }, { storage: '512GB', price: 76999 }], { Black: coloredImageSets['oneplus-black'], White: coloredImageSets['oneplus-white'] }, { '256GB': { Black: 18, White: 16 }, '512GB': { Black: 13, White: 11 } }, { '256GB': 1500, '512GB': 2000 }) },
  { name: 'Xiaomi 15 Ultra', slug: 'xiaomi-15-ultra', description: 'Photography-first flagship with a Leica-inspired camera experience and premium performance.', brand: 'Xiaomi', category: 'smartphones', variants: colorVariants([{ storage: '256GB', price: 89999 }, { storage: '512GB', price: 95999 }], { Black: coloredImageSets['xiaomi-black'], White: coloredImageSets['xiaomi-white'] }, { '256GB': { Black: 10, White: 9 }, '512GB': { Black: 7, White: 6 } }, { '256GB': 2000, '512GB': 2500 }) },
  { name: 'vivo X200 Pro', slug: 'vivo-x200-pro', description: 'A premium portrait flagship with ZEISS imaging and powerful performance.', brand: 'vivo', category: 'smartphones', variants: colorVariants([{ storage: '256GB', price: 89999 }, { storage: '512GB', price: 94999 }], { Blue: coloredImageSets['vivo-blue'], Silver: coloredImageSets['vivo-silver'] }, { '256GB': { Blue: 11, Silver: 10 }, '512GB': { Blue: 9, Silver: 7 } }, { '256GB': 2000, '512GB': 2500 }) },
  { name: 'Nothing Phone (3)', slug: 'nothing-phone-3', description: 'Distinctive transparent design paired with a clean, intelligent smartphone experience.', brand: 'Nothing', category: 'smartphones', variants: colorVariants([{ storage: '256GB', price: 79999 }, { storage: '512GB', price: 86999 }], { White: coloredImageSets['nothing-white'], Black: coloredImageSets['nothing-black'] }, { '256GB': { White: 13, Black: 10 }, '512GB': { White: 8, Black: 7 } }, { '256GB': 2000, '512GB': 2500 }) },
  { name: 'Motorola Edge 60 Pro', slug: 'motorola-edge-60-pro', description: 'A refined edge-to-edge flagship with a vivid display and versatile camera system.', brand: 'Motorola', category: 'smartphones', variants: colorVariants([{ storage: '128GB', price: 54999 }, { storage: '256GB', price: 59999 }], { Purple: coloredImageSets['motorola-purple'], Sky: coloredImageSets['motorola-sky'] }, { '128GB': { Purple: 16, Sky: 14 }, '256GB': { Purple: 16, Sky: 12 } }, { '128GB': 1200, '256GB': 1500 }) },
  { name: 'realme GT 7 Pro', slug: 'realme-gt-7-pro', description: 'Performance-focused flagship built for fast gaming, imaging, and everyday speed.', brand: 'realme', category: 'smartphones', variants: [variant('256GB', 'Black', 69999, coloredImageSets['realme-black'], 14, 1800), variant('256GB', 'Blue', 69999, coloredImageSets['realme-blue'], 12, 1800), variant('512GB', 'Black', 75999, coloredImageSets['realme-black'], 8, 2200), variant('512GB', 'Blue', 75999, coloredImageSets['realme-blue'], 7, 2200)] },
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
