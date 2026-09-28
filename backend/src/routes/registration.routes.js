import { Router } from 'express';
import { registerEvent, cancelRegistration, getMyRegistrations, getEventRegistrations } from '../controllers/registration.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();
router.use(authenticate);
router.get('/registrations/me', getMyRegistrations);
router.post('/events/:eventId/register', requireRole('STUDENT'), registerEvent);
router.delete('/events/:eventId/register', requireRole('STUDENT'), cancelRegistration);
router.get('/events/:eventId/registrations', requireRole('CLUB_MEMBER', 'ADMIN'), getEventRegistrations);
export default router;
