import prisma from '../config/database.js';
import * as noticeService from '../services/notice.service.js';
import { sendSuccess } from '../utils/response.js';

export const list = async (req, res, next) => {
  try {
    const { scope } = req.query;
    const where = {};
    if (scope === 'club' && req.user && req.user.role !== 'ADMIN') {
      const clubIds = (req.user.clubMemberships || []).map(m => m.clubId);
      where.clubId = { in: clubIds };
    }
    const data = await noticeService.listNotices(where);
    sendSuccess(res, data);
  } catch (err) { next(err); }
};

export const create = async (req, res, next) => {
  try {
    let clubId = req.body.clubId || req.user.clubMemberships?.[0]?.clubId;
    if (!clubId) {
      const firstClub = await prisma.club.findFirst();
      clubId = firstClub?.id;
    }
    if (!clubId) {
      return res.status(400).json({ success: false, error: 'No club found to associate notice' });
    }
    const data = await noticeService.createNotice({
      title: req.body.title,
      content: req.body.content,
      priority: req.body.priority || 'NORMAL',
      eventId: req.body.eventId || null,
      clubId,
      status: 'PUBLISHED',
      publishedAt: new Date()
    });
    sendSuccess(res, data, 201);
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if ('eventId' in updateData && !updateData.eventId) {
      updateData.eventId = null;
    }
    const data = await noticeService.updateNotice(req.params.noticeId, updateData);
    sendSuccess(res, data);
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    await noticeService.deleteNotice(req.params.noticeId);
    sendSuccess(res, { message: 'Notice deleted successfully' });
  } catch (err) { next(err); }
};
