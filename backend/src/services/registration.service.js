import prisma from '../config/database.js';
import { AppError } from '../middleware/error.middleware.js';

export const registerForEvent = async (studentId, eventId) => {
  return prisma.$transaction(async (tx) => {
    const event = await tx.event.findUnique({ where: { id: eventId }, include: { _count: { select: { registrations: true } } } });
    if (!event) throw new AppError('Event not found', 404);
    if (event.status !== 'PUBLISHED') throw new AppError('Event is not active', 400);
    if (event.registrationDeadline && new Date() > new Date(event.registrationDeadline)) throw new AppError('Registration closed', 400);
    if (event._count.registrations >= event.capacity) throw new AppError('Event full', 400);

    const existing = await tx.registration.findUnique({ where: { studentId_eventId: { studentId, eventId } } });
    if (existing) throw new AppError('Already registered', 400);

    return tx.registration.create({ data: { studentId, eventId } });
  });
};

export const cancelRegistration = async (studentId, eventId) => {
  return prisma.registration.delete({ where: { studentId_eventId: { studentId, eventId } } });
};

export const getMyRegistrations = async (studentId) => {
  return prisma.registration.findMany({ where: { studentId }, include: { event: true } });
};

export const getEventRegistrations = async (eventId, userId) => {
  return prisma.registration.findMany({ where: { eventId }, include: { student: { select: { id: true, name: true, rollNo: true, email: true } } } });
};
