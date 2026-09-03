import { Router } from 'express';
import { productRouter } from './productRoutes.js';
import { paymentRouter } from './paymentRoutes.js';
import { orderRouter } from './orderRoutes.js';

export const apiRouter = Router();
apiRouter.get('/health', (_request, response) => response.status(200).json({ status: 'ok' }));
apiRouter.use('/products', productRouter);
apiRouter.use('/payments', paymentRouter);
apiRouter.use('/orders', orderRouter);
