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
  const updateData = {};

  if (data.title !== undefined && data.title !== null) updateData.title = String(data.title).trim();
  if (data.description !== undefined && data.description !== null) updateData.description = String(data.description).trim();
  if (data.category !== undefined && data.category !== null) updateData.category = String(data.category).trim() || 'OTHER';
  if (data.status !== undefined && data.status !== null) updateData.status = String(data.status).trim();

  const rawDate = data.eventDate || data.date;
  if (rawDate) {
    const d = new Date(rawDate);
    if (!isNaN(d.getTime())) updateData.eventDate = d;
  }

  if (data.startTime !== undefined && data.startTime !== null) updateData.startTime = String(data.startTime).trim();
  if (data.endTime !== undefined && data.endTime !== null) updateData.endTime = String(data.endTime).trim();

  if (data.capacity !== undefined && data.capacity !== null && data.capacity !== '') {
    const cap = parseInt(data.capacity);
    if (!isNaN(cap)) updateData.capacity = cap;
  }

  if (data.posterUrl) {
    updateData.posterUrl = data.posterUrl;
  }

  if (data.guestName !== undefined || data.guest !== undefined) {
    const g = String(data.guestName || data.guest || '').trim();
    updateData.guestName = g ? g : null;
  }

  const rawDeadline = data.registrationDeadline || data.deadline;
  if (rawDeadline) {
    const d = new Date(rawDeadline);
    if (!isNaN(d.getTime())) updateData.registrationDeadline = d;
  } else if (rawDeadline === '' || rawDeadline === null) {
    updateData.registrationDeadline = null;
  }

  if (data.rules !== undefined && data.rules !== null) {
    if (Array.isArray(data.rules)) {
      updateData.rules = data.rules;
    } else if (typeof data.rules === 'string') {
      updateData.rules = data.rules.split('\n').map(r => r.trim()).filter(Boolean);
    }
  }

  if (data.venueId) {
    updateData.venueId = data.venueId;
  } else if (data.venue !== undefined && data.venue !== null) {
    const vName = String(data.venue).trim();
    if (vName) {
      let venue = await prisma.venue.findFirst({
        where: { name: { equals: vName, mode: 'insensitive' } }
      });
      if (!venue) {
        venue = await prisma.venue.create({ data: { name: vName } });
      }
      updateData.venueId = venue.id;
    }
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
