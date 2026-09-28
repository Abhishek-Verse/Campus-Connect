import { Router } from 'express';
import {
  registerEvent,
  cancelRegistration,
  getMyRegistrations,
  getEventRegistrations,
  getRecentClubRegistrations,
  getClubDashboardStats
} from '../controllers/registration.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();
router.use(authenticate);

router.get('/registrations/me', getMyRegistrations);
router.post('/events/:eventId/register', requireRole('STUDENT', 'CLUB_MEMBER', 'ADMIN'), registerEvent);
router.delete('/events/:eventId/register', requireRole('STUDENT', 'CLUB_MEMBER', 'ADMIN'), cancelRegistration);
router.get('/events/:eventId/registrations', requireRole('CLUB_MEMBER', 'ADMIN'), getEventRegistrations);
router.get('/club/registrations/recent', requireRole('CLUB_MEMBER', 'ADMIN'), getRecentClubRegistrations);
router.get('/club/dashboard-stats', requireRole('CLUB_MEMBER', 'ADMIN'), getClubDashboardStats);

export default router;
