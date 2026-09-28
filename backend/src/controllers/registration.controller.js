import * as registrationService from '../services/registration.service.js';
import prisma from '../config/database.js';
import { sendSuccess } from '../utils/response.js';

export const registerEvent = async (req, res, next) => {
  try {
    const data = await registrationService.registerForEvent(req.user.id, req.params.eventId);
    sendSuccess(res, data, 201);
  } catch (err) { next(err); }
};

export const cancelRegistration = async (req, res, next) => {
  try {
    await registrationService.cancelRegistration(req.user.id, req.params.eventId);
    sendSuccess(res, { message: 'Registration cancelled' });
  } catch (err) { next(err); }
};

export const getMyRegistrations = async (req, res, next) => {
  try {
    const data = await registrationService.getMyRegistrations(req.user.id);
    sendSuccess(res, data);
  } catch (err) { next(err); }
};

export const getEventRegistrations = async (req, res, next) => {
  try {
    const data = await registrationService.getEventRegistrations(req.params.eventId, req.user.id);
    sendSuccess(res, data);
  } catch (err) { next(err); }
};

export const getRecentClubRegistrations = async (req, res, next) => {
  try {
    const clubIds = req.user.role === 'ADMIN'
      ? undefined
      : (req.user.clubMemberships || []).map(m => m.clubId);

    const registrations = await prisma.registration.findMany({
      where: clubIds ? { event: { clubId: { in: clubIds } } } : {},
      include: {
        student: { select: { name: true, rollNo: true } },
        event: { select: { title: true } }
      },
      orderBy: { registeredAt: 'desc' },
      take: 10
    });

    const data = registrations.map(r => ({
      id: r.id,
      studentName: r.student.name,
      rollNo: r.student.rollNo,
      eventTitle: r.event.title,
      createdAt: r.registeredAt
    }));

    sendSuccess(res, data);
  } catch (err) { next(err); }
};

export const getClubDashboardStats = async (req, res, next) => {
  try {
    const clubIds = req.user.role === 'ADMIN'
      ? undefined
      : (req.user.clubMemberships || []).map(m => m.clubId);

    const clubFilter = clubIds ? { clubId: { in: clubIds } } : {};
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [total, upcoming, totalRegistrations, today] = await Promise.all([
      prisma.event.count({ where: clubFilter }),
      prisma.event.count({
        where: {
          ...clubFilter,
          eventDate: { gte: todayStart },
          status: { in: ['PUBLISHED', 'ONGOING'] }
        }
      }),
      prisma.registration.count({
        where: clubIds ? { event: { clubId: { in: clubIds } } } : {}
      }),
      prisma.event.count({
        where: {
          ...clubFilter,
          eventDate: { gte: todayStart, lte: todayEnd }
        }
      })
    ]);

    sendSuccess(res, { total, upcoming, totalRegistrations, today });
  } catch (err) { next(err); }
};
