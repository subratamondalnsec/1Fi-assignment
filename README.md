# 1Fi SDE Assignment

## Overview

This full-stack EMI marketplace is a responsive smartphone catalogue backed by MongoDB. Products load dynamically through Express APIs and support product-specific storage and colour variants, inventory, image galleries, and EMI plans. Every product has a stable slug-based URL.

Customers can add configured products to a persistent cart, select an EMI plan, preview its repayment schedule, and pay the first installment using Razorpay. The backend verifies payments, validates the authoritative product and EMI selection, protects stock, and persists historical orders in MongoDB for order and repayment tracking.

## Features

- Dynamic MongoDB-backed smartphone catalogue
- Storage and colour variants with MRP, price, stock, and image galleries
- Unique slug-based product URLs
- EMI plan selection with tenure, monthly amount, interest, cashback, and description
- EMI summary, repayment preview, and next-due-date tracking
- Persistent cart with selected variants and EMI plans
- Razorpay first-installment checkout and signature verification
- Server-side amount validation, duplicate-payment handling, order snapshots, and stock decrementing
- Order history and repayment schedule views
- Responsive React UI and API-driven architecture

## Tech Stack

### Frontend

- React 19 and React DOM
- Vite 7
- React Router DOM 7
- Tailwind CSS 4 with `@tailwindcss/vite`
- ESLint, React Hooks, and React Refresh plugins

### Backend

- Node.js, Express 5, and Mongoose 8
- Razorpay Node SDK
- dotenv, CORS, Helmet, and Morgan
- Nodemon and ESLint

### Database

MongoDB stores `Product` and `Order` collections. Variants and EMI plans are embedded in products. Orders preserve item, plan, customer, shipping, payment, and repayment snapshots so completed orders remain historically accurate if catalogue data changes.

### Deployment

- Frontend → Vercel
- Backend → Render

Set the deployed API URL and Razorpay public key in the frontend environment. Set the frontend origin, MongoDB URI, and Razorpay credentials in the backend environment. Keep `RAZORPAY_KEY_SECRET` server-side.

## Project Structure

```text
client/
├── public/
├── src/
│   ├── components/       # Layout, home, product, and EMI UI
│   ├── context/          # Cart state
│   ├── hooks/
│   ├── pages/            # Catalogue, cart, checkout, orders, repayment views
│   ├── services/         # Product, payment, and order API clients
│   ├── styles/
│   └── utils/            # Cart, checkout, EMI, order, and variant helpers
├── .env.example
├── package.json
└── vite.config.js

server/
├── src/
│   ├── config/           # MongoDB and Razorpay setup
│   ├── controllers/      # Product, payment, and order handlers
│   ├── middleware/       # 404 and error handlers
│   ├── models/           # Product and Order Mongoose schemas
│   ├── routes/           # API routers
│   ├── seed/             # Product seed script
│   ├── utils/            # Currency and payment-verification helpers
│   ├── app.js
│   └── server.js
├── .env.example
└── package.json
```

## Setup and Run

Prerequisites: Node.js, npm, MongoDB (local or Atlas), and Razorpay test credentials for checkout.

1. From `project/`, install dependencies:

   ```bash
   npm install
   ```

2. Copy `server/.env.example` to `server/.env` and `client/.env.example` to `client/.env`.

3. Configure the following values:

   ```dotenv
   # server/.env
   NODE_ENV=development
   PORT=5000
   CLIENT_URL=http://localhost:5173
   MONGODB_URI=mongodb://127.0.0.1:27017/onefi_catalogue
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

   ```dotenv
   # client/.env
   VITE_API_BASE_URL=http://localhost:5000
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

4. Seed the catalogue and start both workspaces:

   ```bash
   npm run seed --workspace server
   npm run dev
   ```

The client runs at `http://localhost:5173` and the API at `http://localhost:5000` by default. Use `npm run dev:client` or `npm run dev:server` to run either workspace separately.

## Database Schema

### Product Schema

| Field | Type | Purpose |
| --- | --- | --- |
| `name` | String | Required product name. |
| `slug` | String | Required, unique, lowercase URL slug. |
| `description` | String | Product description. |
| `brand` | String | Product manufacturer. |
| `category` | String | Product category. |
| `variants` | `[Variant]` | Required non-empty selectable configurations. |
| `createdAt`, `updatedAt` | Date | Mongoose timestamps. |

The schema indexes `category` and `brand`.

### Variant Schema

| Field | Type | Purpose |
| --- | --- | --- |
| `_id` | ObjectId | Automatically generated embedded ID. |
| `name` | String | Optional display name. |
| `storage` | String | Required storage capacity. |
| `color` | String | Required colour. |
| `mrp` | Number | Required list price; at least `price`. |
| `price` | Number | Required selling price. |
| `images` | `[String]` | Remote image URLs; an image is required here or in `imageUrl`. |
| `imageUrl` | String | Optional primary/legacy image URL. |
| `stock` | Number | Whole-number inventory; defaults to `0`. |
| `emiPlans` | `[EMI Plan]` | Required non-empty financing choices. |

### EMI Plan Schema

| Field | Type | Purpose |
| --- | --- | --- |
| `_id` | ObjectId | Automatically generated embedded ID. |
| `tenure` | Number | Required whole-month duration (1–60). |
| `monthlyAmount` | Number | Required monthly payment. |
| `interestRate` | Number | Required non-negative interest rate. |
| `cashback` | Number | Non-negative cashback; defaults to `0`. |
| `description` | String | Optional plan description. |

### Order Schema

| Field | Type | Purpose |
| --- | --- | --- |
| `orderNumber` | String | Required unique customer-facing number. |
| `items` | `[Order Item]` | Required non-empty purchase snapshot. |
| `customer.fullName` | String | Required customer name. |
| `customer.email` | String | Required normalized email. |
| `customer.phone` | String | Required phone number. |
| `shippingAddress.address` | String | Required street address. |
| `shippingAddress.city` | String | Required city. |
| `shippingAddress.state` | String | Required state. |
| `shippingAddress.pincode` | String | Required postal code. |
| `subtotal` | Number | Product-price total before fees. |
| `platformFee` | Number | Platform fee. |
| `deliveryFee` | Number | Delivery fee. |
| `totalAmount` | Number | Required first-payment total charged. |
| `firstPaymentAmount` | Number | Required first EMI payment total. |
| `scheduledRepayment` | Number | Required total scheduled EMI repayments. |
| `currency` | String | Required `INR`. |
| `paymentMethod` | String | Required `razorpay`. |
| `paymentStatus` | String | `paid`, `failed`, or `refunded`; defaults to `paid`. |
| `razorpayOrderId` | String | Required Razorpay order ID. |
| `razorpayPaymentId` | String | Required, unique Razorpay payment ID. |
| `createdAt`, `updatedAt` | Date | Mongoose timestamps. |

Each order item contains `productId`, `productName`, `variantId`, `variantName`, `storage`, `color`, `imageUrl`, `unitPrice`, `quantity`, `emiPlanId`, `emiTenure`, `emiMonthlyAmount`, `emiInterestRate`, `emiCashback`, `firstPaymentAmount`, and `nextDueDate`.

## Seed Data

Seed data is in `server/src/seed/seed.js`. Running the seed script clears the existing `Product` collection before inserting the demo catalogue, so use it only when replacing local/demo products is intended.

```bash
npm run seed --workspace server
```

The seed contains nine smartphones: iPhone 17 Pro, Samsung Galaxy S24 Ultra, Google Pixel 9 Pro, OnePlus 13, Xiaomi 15 Ultra, vivo X200 Pro, Nothing Phone (3), Motorola Edge 60 Pro, and realme GT 7 Pro. It inserts 36 storage/colour variants; every variant has images, stock, and seven illustrative EMI plans (3, 6, 12, 24, 36, 48, and 60 months).

## API Endpoints

All routes are prefixed with `/api`. Error responses use `{ "success": false, "message": "..." }`.

### `GET /api/health`

Purpose: confirms the API is responding.

```json
{ "status": "ok" }
```

### `GET /api/products`

Purpose: returns all products and variants. Listing responses omit `emiPlans`.

```json
{
  "success": true,
  "data": [{
    "id": "productId",
    "name": "iPhone 17 Pro",
    "slug": "iphone-17-pro",
    "variants": [{ "id": "variantId", "storage": "256GB", "color": "Orange", "price": 134900, "mrp": 144900, "images": [], "imageUrl": "https://...", "stock": 12 }]
  }]
}
```

### `GET /api/products/:slug`

Purpose: returns one product with its selectable EMI plans.

```json
{
  "success": true,
  "data": {
    "id": "productId",
    "slug": "iphone-17-pro",
    "variants": [{
      "id": "variantId",
      "emiPlans": [{ "id": "planId", "tenure": 12, "monthlyAmount": 11242, "interestRate": 0, "cashback": 4000, "description": "Illustrative no-cost EMI plan." }]
    }]
  }
}
```

### `POST /api/payments/create-order`

Purpose: creates a Razorpay order for the first EMI payment. With `items`, the server calculates the amount from selected plans.

Request:

```json
{
  "amount": 11242,
  "currency": "INR",
  "items": [{ "productId": "productId", "variantId": "variantId", "emiPlanId": "planId", "quantity": 1 }]
}
```

Response (`201`):

```json
{ "success": true, "data": { "id": "order_RazorpayId", "amount": 1124200, "currency": "INR", "status": "created" } }
```

### `POST /api/payments/verify`

Purpose: verifies a Razorpay payment signature.

Request:

```json
{ "razorpay_order_id": "order_RazorpayId", "razorpay_payment_id": "pay_RazorpayId", "razorpay_signature": "signature" }
```

Response:

```json
{ "success": true, "data": { "verified": true } }
```

### `POST /api/orders`

Purpose: re-verifies payment, validates product/plan/stock, saves the order, and decrements stock.

Request:

```json
{
  "items": [{ "productId": "productId", "variantId": "variantId", "emiPlanId": "planId", "quantity": 1 }],
  "customer": { "fullName": "Asha Sharma", "email": "asha@example.com", "phone": "9876543210" },
  "shippingAddress": { "address": "12 Market Road", "city": "Mumbai", "state": "Maharashtra", "pincode": "400001" },
  "razorpayOrderId": "order_RazorpayId",
  "razorpayPaymentId": "pay_RazorpayId",
  "razorpaySignature": "signature",
  "currency": "INR"
}
```

Response (`201`):

```json
{ "success": true, "data": { "id": "orderId", "orderNumber": "1FI-...", "paymentStatus": "paid", "currency": "INR", "items": [], "createdAt": "2026-01-01T00:00:00.000Z" } }
```

A repeated verified payment returns `200` with the saved order and `"duplicate": true`.

### `GET /api/orders/:id`

Purpose: returns a saved order and its item-level repayment snapshot.

```json
{ "success": true, "data": { "id": "orderId", "orderNumber": "1FI-...", "items": [], "customer": {}, "shippingAddress": {}, "totalAmount": 11242, "scheduledRepayment": 134904, "paymentStatus": "paid" } }
```

## Scripts

```bash
npm run dev                         # Run client and server together
npm run build                       # Build the client
npm run lint                        # Lint both workspaces
npm run seed --workspace server     # Replace product data with the seed catalogue
npm run start --workspace server    # Start the API
```
