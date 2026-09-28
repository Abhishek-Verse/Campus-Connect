import { Router } from 'express';
import { scan, list, exportAtt } from '../controllers/attendance.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { scanSchema } from '../validators/attendance.validators.js';

const router = Router();
router.use(authenticate, requireRole('CLUB_MEMBER', 'ADMIN'));
router.post('/events/:eventId/attendance/scan', validate(scanSchema), scan);
router.get('/events/:eventId/attendance', list);
router.get('/events/:eventId/attendance/export', exportAtt);
export default router;
