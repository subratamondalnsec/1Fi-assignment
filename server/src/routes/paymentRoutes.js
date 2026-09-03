import { Router } from 'express';
import { createOrder } from '../controllers/paymentController.js';

export const paymentRouter = Router();
paymentRouter.post('/create-order', createOrder);
