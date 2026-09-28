import prisma from '../config/database.js';
import { AppError } from '../middleware/error.middleware.js';

export const listEvents = async ({ page = 1, limit = 20, status, category, title, search, scope, user } = {}) => {
  const where = {};
  const querySearch = search || title;

  if (scope === 'club' && user) {
    if (user.role !== 'ADMIN') {
      const clubIds = (user.clubMemberships || []).map(m => m.clubId);
      where.clubId = { in: clubIds };
    }
    if (status && status !== 'ALL') {
      where.status = status;
    }
  } else {
    if (status && status !== 'ALL') {
      where.status = status;
    } else if (!status) {
      where.status = 'PUBLISHED';
    }
    if (category && category !== 'ALL') {
      where.category = category;
    }
    if (querySearch) {
      where.OR = [
        { title: { contains: querySearch, mode: 'insensitive' } },
        { description: { contains: querySearch, mode: 'insensitive' } }
      ];
    }
  }

  const take = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
  const skip = (Math.max(parseInt(page) || 1, 1) - 1) * take;

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      include: {
        club: { select: { id: true, name: true, logoUrl: true } },
        venue: { select: { id: true, name: true, location: true } },
        _count: { select: { registrations: true, attendance: true } }
      },
      orderBy: { eventDate: 'desc' },
      skip,
      take
    }),
    prisma.event.count({ where })
  ]);

  const formatted = events.map(e => ({
    ...e,
    date: e.eventDate,
    venue: e.venue?.name || 'TBD',
    venueLocation: e.venue?.location || '',
    clubName: e.club?.name || '',
    registeredCount: e._count.registrations,
    registrationCount: e._count.registrations,
    attendanceCount: e._count.attendance,
    availableSeats: Math.max(0, e.capacity - e._count.registrations)
  }));

  return { events: formatted, total, page: parseInt(page) || 1, limit: take };
};

export const listPublishedEvents = async (page = 1, limit = 10, filters = {}) => {
  const result = await listEvents({ page, limit, ...filters });
  return result.events;
};

export const getEventById = async (eventId) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      club: { select: { id: true, name: true, logoUrl: true } },
      venue: { select: { id: true, name: true, location: true } },
      _count: { select: { registrations: true, attendance: true } }
    }
  });
  if (!event) throw new AppError('Event not found', 404);
  const registeredCount = event._count.registrations;
  const availableSeats = Math.max(0, event.capacity - registeredCount);
  return {
    ...event,
    date: event.eventDate,
    venue: event.venue?.name || 'TBD',
    venueName: event.venue?.name || 'TBD',
    venueLocation: event.venue?.location || '',
    clubName: event.club?.name || '',
    registeredCount,
    availableSeats
  };
};

export const createEvent = async (clubId, data) => {
  const eventDate = data.eventDate ? new Date(data.eventDate) : (data.date ? new Date(data.date) : new Date());
  const registrationDeadline = data.registrationDeadline ? new Date(data.registrationDeadline) : null;

  let venueId = data.venueId || null;
  if (!venueId && data.venue) {
    let venue = await prisma.venue.findFirst({
      where: { name: { equals: data.venue.trim(), mode: 'insensitive' } }
    });
    if (!venue) {
      venue = await prisma.venue.create({ data: { name: data.venue.trim() } });
    }
    venueId = venue.id;
  }

  return prisma.event.create({
    data: {
      title: data.title,
      description: data.description || '',
      category: data.category || 'OTHER',
      eventDate,
      startTime: data.startTime || '10:00',
      endTime: data.endTime || '12:00',
      capacity: parseInt(data.capacity) || 50,
      posterUrl: data.posterUrl || null,
      guestName: data.guestName || data.guest || null,
      registrationDeadline,
      rules: Array.isArray(data.rules) ? data.rules : (typeof data.rules === 'string' ? data.rules.split('\n').filter(Boolean) : []),
      status: data.status || 'DRAFT',
      clubId,
      venueId
    }
  });
};

export const updateEvent = async (eventId, userId, data) => {
  const updateData = { ...data };
  if (updateData.eventDate) updateData.eventDate = new Date(updateData.eventDate);
  if (updateData.date) {
    updateData.eventDate = new Date(updateData.date);
    delete updateData.date;
  }
  if (updateData.registrationDeadline) {
    updateData.registrationDeadline = new Date(updateData.registrationDeadline);
  }
  if (updateData.deadline) {
    updateData.registrationDeadline = new Date(updateData.deadline);
    delete updateData.deadline;
  }
  if (updateData.capacity) {
    updateData.capacity = parseInt(updateData.capacity);
  }
  if (typeof updateData.rules === 'string') {
    updateData.rules = updateData.rules.split('\n').filter(Boolean);
  }
  if (updateData.guest && !updateData.guestName) {
    updateData.guestName = updateData.guest;
    delete updateData.guest;
  }
  if (!updateData.venueId && updateData.venue) {
    let venue = await prisma.venue.findFirst({
      where: { name: { equals: updateData.venue.trim(), mode: 'insensitive' } }
    });
    if (!venue) {
      venue = await prisma.venue.create({ data: { name: updateData.venue.trim() } });
    }
    updateData.venueId = venue.id;
    delete updateData.venue;
  }
  return prisma.event.update({ where: { id: eventId }, data: updateData });
};

export const publishEvent = async (eventId, userId) => {
  return prisma.event.update({ where: { id: eventId }, data: { status: 'PUBLISHED' } });
};

export const cancelEvent = async (eventId, userId) => {
  return prisma.event.update({ where: { id: eventId }, data: { status: 'CANCELLED' } });
};

export const deleteEvent = async (eventId, userId) => {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw new AppError('Event not found', 404);
  if (event.status !== 'DRAFT') throw new AppError('Only DRAFT events can be deleted', 400);
  return prisma.event.delete({ where: { id: eventId } });
};
