import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { registerSchema, loginSchema } from '../validators/auth.validators.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', authenticate, (req, res) => res.json({ success: true, data: 'Logged out' }));
router.get('/me', authenticate, getMe);
export default router;
