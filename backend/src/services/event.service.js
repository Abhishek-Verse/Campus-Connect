import prisma from '../config/database.js';
import { AppError } from '../middleware/error.middleware.js';

export const listPublishedEvents = async (page = 1, limit = 10, filters = {}) => {
  return prisma.event.findMany({ where: { status: 'PUBLISHED' }, include: { club: true, venue: true } });
};

export const getEventById = async (eventId) => {
  const event = await prisma.event.findUnique({ where: { id: eventId }, include: { club: true, venue: true, _count: { select: { registrations: true } } } });
  if (!event) throw new AppError('Event not found', 404);
  const availableSeats = event.capacity - event._count.registrations;
  return { ...event, availableSeats };
};

export const createEvent = async (clubId, data) => {
  return prisma.event.create({ data: { ...data, clubId } });
};

export const updateEvent = async (eventId, userId, data) => {
  return prisma.event.update({ where: { id: eventId }, data });
};

export const publishEvent = async (eventId, userId) => {
  return prisma.event.update({ where: { id: eventId }, data: { status: 'PUBLISHED' } });
};

export const cancelEvent = async (eventId, userId) => {
  return prisma.event.update({ where: { id: eventId }, data: { status: 'CANCELLED' } });
};

export const deleteEvent = async (eventId, userId) => {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (event?.status !== 'DRAFT') throw new AppError('Only DRAFT events can be deleted', 400);
  return prisma.event.delete({ where: { id: eventId } });
};
