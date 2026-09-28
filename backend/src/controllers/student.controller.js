import prisma from '../config/database.js';
import { sendSuccess } from '../utils/response.js';
import * as authService from '../services/auth.service.js';
import * as registrationService from '../services/registration.service.js';

export const getMeProfile = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    sendSuccess(res, user);
  } catch (err) { next(err); }
};

export const getQr = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { qrToken: true } });
    sendSuccess(res, user);
  } catch (err) { next(err); }
};

export const getMyEvents = async (req, res, next) => {
  try {
    const data = await registrationService.getMyRegistrations(req.user.id);
    sendSuccess(res, data);
  } catch (err) { next(err); }
};

export const getMyAttendance = async (req, res, next) => {
  try {
    const data = await prisma.attendance.findMany({ where: { studentId: req.user.id }, include: { event: true } });
    sendSuccess(res, data);
  } catch (err) { next(err); }
};
