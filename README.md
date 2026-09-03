# 1Fi Smartphone Catalogue

Foundation repository for the 1Fi SDE full-stack internship assignment. The planned application lets customers browse smartphones, select a variant, compare EMI plans, and complete a Razorpay payment.

## Stack

- Client: React, Vite, Tailwind CSS, React Router
- API: Node.js, Express, Mongoose
- Data: MongoDB
- Payment (planned): Razorpay

## Workspace layout

```text
project/
├── client/                 # React/Vite application
│   ├── src/components/
│   ├── src/pages/
│   └── src/styles/
├── server/                 # Express API
│   └── src/{config,middleware,routes}/
├── .gitignore
└── package.json
```

This phase intentionally contains no product, variant, EMI, cart, authentication, or payment business implementation. The only API endpoint is `GET /api/health`, which verifies the server foundation once MongoDB is configured.

## Local development

1. Install Node.js 20+ and run MongoDB locally, or obtain a MongoDB Atlas connection string.
2. Copy `client/.env.example` to `client/.env` and `server/.env.example` to `server/.env`.
3. Set `MONGODB_URI` in `server/.env`.
4. Install and run:

   ```bash
   npm install
   npm run dev
   ```

The client runs at `http://localhost:5173`; the API runs at `http://localhost:5000`, with Vite proxying `/api` requests.

## Quality commands

```bash
npm run lint
npm run build
npm run start
```

## Implementation boundary

Reference repositories remain outside this workspace and are ignored by Git. Their architecture may inform the implementation, but this codebase will only use the agreed React/Vite/Tailwind/React Router and Express/MongoDB/Mongoose stack, with Razorpay instead of Stripe.
