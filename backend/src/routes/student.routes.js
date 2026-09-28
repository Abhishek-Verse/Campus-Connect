import { Router } from 'express';
import { getMeProfile, getQr, getMyEvents, getMyAttendance } from '../controllers/student.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();
router.use(authenticate);
router.get('/me', getMeProfile);
router.patch('/me', (req, res) => res.json({ success: true, data: 'Not implemented' }));
router.get('/me/qr', getQr);
router.get('/me/events', getMyEvents);
router.get('/me/attendance', getMyAttendance);
export default router;
