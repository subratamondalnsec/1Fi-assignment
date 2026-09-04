# 1Fi Smartphone Financing Catalogue

Premium smartphone catalogue and illustrative investment-backed EMI experience for the 1Fi internship assignment.

## Features

- MongoDB-backed smartphone catalogue with variants, storage, colors, stock, and remote image galleries.
- Selectable EMI plans with monthly payment, tenure, interest, cashback, first payment, and repayment preview.
- Independent storage and color selection with explicit valid-variant fallback.
- Persistent cart containing product, variant, and EMI selections.
- Razorpay checkout for the first illustrative EMI installment.
- Server-side Razorpay signature verification, authoritative amount checks, order snapshots, stock protection, and duplicate-payment handling.
- Responsive React/Vite UI with product cards, detail pages, gallery thumbnails, checkout, and order success.

## Stack and Architecture

- Client: React, Vite, Tailwind CSS, React Router
- Server: Node.js, Express, Mongoose
- Database: MongoDB
- Payments: Razorpay

`client/src` contains pages, reusable product/EMI components, cart context, API services, and pure calculation helpers. `server/src` contains Express routes/controllers, Mongoose models, seed data, payment verification, and centralized errors.

## Setup

1. Use Node.js 20+ and a running MongoDB instance or MongoDB Atlas database.
2. Copy `server/.env.example` to `server/.env` and `client/.env.example` to `client/.env`.
3. Set `MONGODB_URI`, `RAZORPAY_KEY_ID`, and `RAZORPAY_KEY_SECRET` in `server/.env`.
4. Set `VITE_API_BASE_URL` and the public `VITE_RAZORPAY_KEY_ID` in `client/.env`.
5. Install and run:

   ```bash
   npm install
   npm run seed --workspace server
   npm run dev
   ```

The client normally runs at `http://localhost:5173` and the API at `http://localhost:5000`.

## API

- `GET /api/health`
- `GET /api/products`
- `GET /api/products/:slug`
- `POST /api/payments/create-order`
- `POST /api/payments/verify`
- `POST /api/orders`
- `GET /api/orders/:id`

Product responses contain product metadata and variant snapshots including `storage`, `color`, `price`, `mrp`, `images`, legacy `imageUrl` for compatibility, `stock`, and `emiPlans`.

Order creation requires the Razorpay order ID, payment ID, and signature. The server re-verifies the signature, reloads product and EMI data, calculates the first installment, checks the Razorpay amount and currency, decrements stock, and stores a historical order snapshot. The client clears the cart only after successful order creation.

## Data Model

Product variants contain `storage`, `color`, `mrp`, `price`, `images`, legacy `imageUrl`, `stock`, and embedded `emiPlans`. EMI plans contain `tenure`, `monthlyAmount`, `interestRate`, `cashback`, and `description`.

Orders preserve product, variant, price, quantity, EMI, first-payment, next-due-date, scheduled-repayment, customer, shipping, and Razorpay identifiers.

The seed contains nine products, twenty variants, and seven illustrative EMI plans per flagship variant. Plans use 0% for 3-24 months and 10.5% for 36-60 months. These are demo values, not real 1Fi lending terms.

## EMI Flow

Product selection leads to an EMI plan, selected-plan summary, demo eligibility estimate, and `/repayment-preview`. EMI utilities calculate scheduled repayment, first payment, due dates, remaining installments, and compact key-payment timelines. The first installment is the illustrative amount paid through Razorpay; the product price remains separate purchase metadata.

## Testing

```bash
npm run lint
npm run build
npm run test:emi-helpers --workspace client
npm run test:payment-verification --workspace server
npm run test:order-model --workspace server
npm run test:order-helper --workspace client
npm run test:variant-selector --workspace client
npm run test:product-model --workspace server
git diff --check
```

## Deployment and Demo

Configure the production MongoDB URI, Razorpay test/live keys, client API base URL, and server client origin in the deployment environment. Deploy the client and API through the platform of choice while keeping Razorpay secrets server-side.

- Demo URL: _to be added_
- Demo video: _to be added_

## Limitations

EMI and eligibility values are illustrative demo calculations. No authentication, KYC, Aadhaar/PAN verification, credit decision, lending provider, webhook, or real investment verification is implemented. Standalone MongoDB deployments use guarded stock updates with rollback when transactions are unavailable.
