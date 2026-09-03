import mongoose from 'mongoose';

const { Schema } = mongoose;

const remoteImageValidator = (image) => {
  try {
    const url = new URL(image);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
};

const emiPlanSchema = new Schema(
  {
    tenure: { type: Number, required: true, min: 1, max: 60, validate: { validator: Number.isInteger, message: 'EMI tenure must be a whole number of months.' } },
    monthlyAmount: { type: Number, required: true, min: 0.01 },
    interestRate: { type: Number, required: true, min: 0 },
    cashback: { type: Number, default: 0, min: 0 },
    description: { type: String, trim: true, maxlength: 240 },
  },
  { _id: true },
);

const variantSchema = new Schema(
  {
    name: { type: String, trim: true, maxlength: 120 },
    storage: { type: String, required: true, trim: true, maxlength: 50 },
    color: { type: String, required: true, trim: true, maxlength: 80 },
    mrp: { type: Number, required: true, min: 0.01, validate: { validator: function validateMrp(value) { return value >= this.price; }, message: 'MRP must be greater than or equal to price.' } },
    price: { type: Number, required: true, min: 0.01 },
    images: { type: [String], default: [], validate: [{ validator: function hasImage(images) { return images.length > 0 || remoteImageValidator(this.imageUrl); }, message: 'Each variant must include at least one image.' }, { validator: (images) => images.every((image) => typeof image === 'string' && remoteImageValidator(image.trim())), message: 'Images must contain valid remote URLs.' }] },
    imageUrl: { type: String, trim: true, maxlength: 2_048 },
    stock: { type: Number, default: 0, min: 0, validate: { validator: Number.isInteger, message: 'Stock must be a whole number.' } },
    emiPlans: { type: [emiPlanSchema], default: [], validate: { validator: (plans) => plans.length > 0, message: 'Each variant must include at least one EMI plan.' } },
  },
  { _id: true },
);

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ },
    description: { type: String, trim: true, maxlength: 2_000 },
    brand: { type: String, trim: true, maxlength: 80 },
    category: { type: String, trim: true, maxlength: 80 },
    variants: { type: [variantSchema], required: true, validate: { validator: (variants) => variants.length > 0, message: 'A product must include at least one variant.' } },
  },
  { timestamps: true },
);

productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });

export const Product = mongoose.model('Product', productSchema);
