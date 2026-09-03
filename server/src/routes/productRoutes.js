import { Router } from 'express';
import { getProductBySlug, getProducts } from '../controllers/productController.js';

export const productRouter = Router();

productRouter.get('/', getProducts);
productRouter.get('/:slug', getProductBySlug);
