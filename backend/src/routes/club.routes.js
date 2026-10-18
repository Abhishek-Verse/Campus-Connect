import { Router } from 'express';
import { list, get, create } from '../controllers/club.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createClubSchema } from '../validators/club.validators.js';

const router = Router();

router.get('/', list);
router.get('/:clubId', get);
router.post('/', optionalAuth, validate(createClubSchema), create);

export default router;
