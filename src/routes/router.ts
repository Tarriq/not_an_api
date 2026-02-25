import { Router } from 'express';
import storyRoutes from './story.routes.js';
import categoryRoutes from './category.routes.js';
import userRoutes from './user.routes.js';
import contactRoutes from './contact.routes.js'

const router = Router();

router.use('/stories', storyRoutes);
router.use('/categories', categoryRoutes);
router.use('/user', userRoutes);
router.use('/contact', contactRoutes);

export default router;