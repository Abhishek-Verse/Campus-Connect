import { Router } from 'express';
import { list, create, update, remove } from '../controllers/notice.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createNoticeSchema, updateNoticeSchema } from '../validators/notice.validators.js';

const router = Router();
router.get('/', optionalAuth, list);

router.use(authenticate, requireRole('CLUB_MEMBER', 'ADMIN'));
router.post('/', validate(createNoticeSchema), create);
router.patch('/:noticeId', validate(updateNoticeSchema), update);
router.put('/:noticeId', validate(updateNoticeSchema), update);
router.delete('/:noticeId', remove);

export default router;
