import { Router } from 'express';
import { handleContactForm } from '../controllers/contact/contact.controller.js';

const router = Router();

router.post('/', handleContactForm);

export default router;