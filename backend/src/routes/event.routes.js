import { Router } from 'express';
import { list, get, create, update, remove, publish, cancel } from '../controllers/event.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { handlePosterUpload } from '../middleware/upload.middleware.js';
import { createEventSchema, updateEventSchema } from '../validators/event.validators.js';

const router = Router();
const requireClub = [authenticate, requireRole('CLUB_MEMBER', 'ADMIN')];

router.get('/', optionalAuth, list);
router.get('/:eventId', optionalAuth, get);

router.post('/', requireClub, handlePosterUpload, validate(createEventSchema), create);
router.patch('/:eventId', requireClub, handlePosterUpload, validate(updateEventSchema), update);
router.put('/:eventId', requireClub, handlePosterUpload, validate(updateEventSchema), update);
router.delete('/:eventId', requireClub, remove);
router.post('/:eventId/publish', requireClub, publish);
router.post('/:eventId/cancel', requireClub, cancel);

export default router;
