import { Router } from 'express';
export const apiRouter = Router();
apiRouter.get('/health', (_request, response) => response.status(200).json({ status: 'ok' }));
