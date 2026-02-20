import { Router } from 'express';
import storyRoutes from './storyRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import userRoutes from './userRoutes.js';

const apiRouter = Router();

apiRouter.use('/stories', storyRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/user', userRoutes);

export default apiRouter;