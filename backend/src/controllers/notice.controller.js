import * as noticeService from '../services/notice.service.js';
import { sendSuccess } from '../utils/response.js';

export const list = async (req, res, next) => {
  try {
    const data = await noticeService.listNotices({});
    sendSuccess(res, data);
  } catch (err) { next(err); }
};

export const create = async (req, res, next) => {
  try {
    const clubId = req.user.clubMemberships?.[0]?.clubId;
    const data = await noticeService.createNotice({ ...req.body, clubId });
    sendSuccess(res, data, 201);
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const data = await noticeService.updateNotice(req.params.noticeId, req.body);
    sendSuccess(res, data);
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    await noticeService.deleteNotice(req.params.noticeId);
    sendSuccess(res, null);
  } catch (err) { next(err); }
};
