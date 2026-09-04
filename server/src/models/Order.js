import mongoose from "mongoose";

const { Schema } = mongoose;

const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, required: true },
    productName: { type: String, required: true, trim: true, maxlength: 160 },
    variantId: { type: Schema.Types.ObjectId, required: true },
    variantName: { type: String, trim: true, maxlength: 120 },
    storage: { type: String, trim: true, maxlength: 50 },
    color: { type: String, trim: true, maxlength: 80 },
    imageUrl: { type: String, trim: true, maxlength: 2_048 },
    unitPrice: { type: Number, required: true, min: 0.01 },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be a whole number.",
      },
    },
    emiPlanId: { type: Schema.Types.ObjectId, required: true },
    emiTenure: { type: Number, required: true, min: 1, max: 60 },
    emiMonthlyAmount: { type: Number, required: true, min: 0.01 },
    emiInterestRate: { type: Number, required: true, min: 0 },
    emiCashback: { type: Number, required: true, min: 0 },
    firstPaymentAmount: { type: Number, required: true, min: 0.01 },
    nextDueDate: { type: Date },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true, trim: true },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "An order must contain at least one item.",
      },
    },
    customer: {
      fullName: { type: String, required: true, trim: true, maxlength: 120 },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 254,
      },
      phone: { type: String, required: true, trim: true, maxlength: 30 },
    },
    shippingAddress: {
      address: { type: String, required: true, trim: true, maxlength: 300 },
      city: { type: String, required: true, trim: true, maxlength: 100 },
      state: { type: String, required: true, trim: true, maxlength: 100 },
      pincode: { type: String, required: true, trim: true, maxlength: 20 },
    },
    subtotal: { type: Number, required: true, min: 0.01 },
    platformFee: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0.01 },
    firstPaymentAmount: { type: Number, required: true, min: 0.01 },
    scheduledRepayment: { type: Number, required: true, min: 0.01 },
    currency: { type: String, required: true, enum: ["INR"], default: "INR" },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["razorpay"],
      default: "razorpay",
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["paid", "failed", "refunded"],
      default: "paid",
    },
    razorpayOrderId: { type: String, required: true, trim: true },
    razorpayPaymentId: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

orderSchema.index({ razorpayPaymentId: 1 }, { unique: true });

export const Order = mongoose.model("Order", orderSchema);
