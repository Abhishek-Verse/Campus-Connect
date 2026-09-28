import { Router } from 'express';
import { list, get, create, update, remove, publish, cancel } from '../controllers/event.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createEventSchema, updateEventSchema } from '../validators/event.validators.js';

const router = Router();
router.get('/', list);
router.get('/:eventId', get);

router.use(authenticate, requireRole('CLUB_MEMBER', 'ADMIN'));
router.post('/', validate(createEventSchema), create);
router.patch('/:eventId', validate(updateEventSchema), update);
router.delete('/:eventId', remove);
router.post('/:eventId/publish', publish);
router.post('/:eventId/cancel', cancel);
export default router;
