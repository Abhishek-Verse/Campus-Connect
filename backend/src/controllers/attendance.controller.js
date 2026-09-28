import * as attendanceService from '../services/attendance.service.js';
import * as exportService from '../services/export.service.js';
import { sendSuccess } from '../utils/response.js';

export const scan = async (req, res, next) => {
  try {
    const data = await attendanceService.scanAttendance(req.params.eventId, req.body.qrToken, req.user.id);
    sendSuccess(res, data);
  } catch (err) { next(err); }
};

export const list = async (req, res, next) => {
  try {
    const data = await attendanceService.getEventAttendance(req.params.eventId, req.user.id);
    sendSuccess(res, data);
  } catch (err) { next(err); }
};

export const exportAtt = async (req, res, next) => {
  try {
    const { buffer, filename, contentType } = await exportService.exportAttendance(req.params.eventId, 'xlsx');
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err) { next(err); }
};
