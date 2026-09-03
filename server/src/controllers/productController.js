import { Product } from '../models/Product.js';

function toProductResponse(product, includeEmiPlans = false) {
  return {
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    description: product.description,
    brand: product.brand,
    category: product.category,
    variants: product.variants.map((variant) => ({
      id: variant._id.toString(),
      name: variant.name,
      storage: variant.storage,
      color: variant.color,
      mrp: variant.mrp,
      price: variant.price,
      imageUrl: variant.imageUrl,
      stock: variant.stock,
      ...(includeEmiPlans && {
        emiPlans: [...variant.emiPlans]
          .sort((firstPlan, secondPlan) => firstPlan.tenure - secondPlan.tenure)
          .map((plan) => ({
            id: plan._id.toString(),
            tenure: plan.tenure,
            monthlyAmount: plan.monthlyAmount,
            interestRate: plan.interestRate,
            cashback: plan.cashback,
            description: plan.description,
          })),
      }),
    })),
  };
}

export async function getProducts(_request, response, next) {
  try {
    const products = await Product.find().select('-createdAt -updatedAt -__v').lean();
    response.status(200).json({ success: true, data: products.map((product) => toProductResponse(product)) });
  } catch (error) {
    next(error);
  }
}

export async function getProductBySlug(request, response, next) {
  try {
    const product = await Product.findOne({ slug: request.params.slug }).select('-createdAt -updatedAt -__v').lean();

    if (!product) {
      return response.status(404).json({ success: false, message: 'Product not found' });
    }

    return response.status(200).json({ success: true, data: toProductResponse(product, true) });
  } catch (error) {
    return next(error);
  }
}
