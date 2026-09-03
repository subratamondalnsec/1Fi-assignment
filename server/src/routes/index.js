import { Router } from 'express';
import { productRouter } from './productRoutes.js';

export const apiRouter = Router();
apiRouter.get('/health', (_request, response) => response.status(200).json({ status: 'ok' }));
apiRouter.use('/products', productRouter);
