import { Router } from 'express';
import {
  getMeProfile,
  updateMeProfile,
  getQr,
  getMyEvents,
  getMyAttendance,
  getDashboardStats
} from '../controllers/student.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();
router.use(authenticate);

router.get('/me', getMeProfile);
router.patch('/me', updateMeProfile);
router.put('/me', updateMeProfile);
router.get('/me/qr', getQr);
router.get('/me/events', getMyEvents);
router.get('/me/attendance', getMyAttendance);
router.get('/me/dashboard-stats', getDashboardStats);

export default router;
