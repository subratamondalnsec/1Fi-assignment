import { Router } from 'express';
import { createOrder, getOrderById } from '../controllers/orderController.js';

export const orderRouter = Router();
orderRouter.post('/', createOrder);
orderRouter.get('/:id', getOrderById);