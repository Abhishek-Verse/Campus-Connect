import prisma from '../config/database.js';
import { AppError } from '../middleware/error.middleware.js';

export const registerForEvent = async (studentId, eventId) => {
  return prisma.$transaction(async (tx) => {
    const event = await tx.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { registrations: true } } }
    });
    if (!event) throw new AppError('Event not found', 404);
    if (event.status !== 'PUBLISHED') throw new AppError('Event is not active for registration', 400);
    if (event.registrationDeadline && new Date() > new Date(event.registrationDeadline)) {
      throw new AppError('Registration closed', 400);
    }
    if (event._count.registrations >= event.capacity) {
      throw new AppError('Event full', 400);
    }

    const existing = await tx.registration.findUnique({
      where: { studentId_eventId: { studentId, eventId } }
    });
    if (existing) throw new AppError('Already registered', 400);

    return tx.registration.create({
      data: { studentId, eventId }
    });
  });
};

export const cancelRegistration = async (studentId, eventId) => {
  const reg = await prisma.registration.findUnique({
    where: { studentId_eventId: { studentId, eventId } }
  });
  if (!reg) throw new AppError('Registration not found', 404);

  return prisma.registration.delete({
    where: { studentId_eventId: { studentId, eventId } }
  });
};

export const getMyRegistrations = async (studentId) => {
  const registrations = await prisma.registration.findMany({
    where: { studentId },
    include: {
      event: {
        include: {
          club: { select: { name: true } },
          venue: { select: { name: true } }
        }
      },
      attendance: true
    },
    orderBy: { registeredAt: 'desc' }
  });

  return registrations.map(r => {
    const isAttended = r.attendance && r.attendance.length > 0;
    const now = new Date();
    const eventDate = new Date(r.event.eventDate);
    const [endH = '23', endM = '59'] = (r.event.endTime || '23:59').split(':');
    eventDate.setHours(parseInt(endH), parseInt(endM), 59, 999);
    const isPast = eventDate < now;
    const attendanceStatus = isAttended ? 'PRESENT' : (isPast ? 'ABSENT' : 'PENDING');

    return {
      id: r.id,
      eventId: r.eventId,
      eventTitle: r.event.title,
      title: r.event.title,
      eventDate: r.event.eventDate,
      date: r.event.eventDate,
      startTime: r.event.startTime,
      endTime: r.event.endTime,
      venue: r.event.venue?.name || 'TBD',
      clubName: r.event.club?.name || '',
      registrationStatus: r.status,
      status: r.status,
      attendanceStatus,
      attended: isAttended,
      checkInTime: isAttended ? r.attendance[0].checkInTime : null,
      registeredAt: r.registeredAt
    };
  });
};

export const getEventRegistrations = async (eventId, userId) => {
  const registrations = await prisma.registration.findMany({
    where: { eventId },
    include: {
      student: { 
        select: { 
          id: true, 
          name: true, 
          rollNo: true, 
          email: true,
          erpId: true,
          department: true,
          division: true,
          college: true,
          gender: true,
          admissionYear: true,
          passingYear: true
        } 
      }
    },
    orderBy: { registeredAt: 'asc' }
  });

  return registrations.map(r => ({
    id: r.id,
    studentId: r.student.id,
    eventId: r.eventId,
    studentName: r.student.name,
    name: r.student.name,
    rollNo: r.student.rollNo,
    email: r.student.email,
    erpId: r.student.erpId || '-',
    department: r.student.department || '-',
    division: r.student.division || '-',
    college: r.student.college || '-',
    gender: r.student.gender || '-',
    admissionYear: r.student.admissionYear || '-',
    passingYear: r.student.passingYear || '-',
    status: r.status,
    createdAt: r.registeredAt,
    registeredAt: r.registeredAt,
    student: r.student
  }));
};
