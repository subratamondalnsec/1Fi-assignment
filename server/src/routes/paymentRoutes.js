import { Router } from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';

export const paymentRouter = Router();
paymentRouter.post('/create-order', createOrder);
paymentRouter.post('/verify', verifyPayment);
