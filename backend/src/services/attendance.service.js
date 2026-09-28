import prisma from '../config/database.js';
import { AppError } from '../middleware/error.middleware.js';

export const scanAttendance = async (eventId, qrToken, scannedById) => {
  return prisma.$transaction(async (tx) => {
    const event = await tx.event.findUnique({ where: { id: eventId } });
    if (!event || (event.status !== 'PUBLISHED' && event.status !== 'ONGOING')) {
      throw new AppError('EVENT_NOT_ACTIVE', 400);
    }

    const student = await tx.user.findUnique({ where: { qrToken } });
    if (!student) throw new AppError('INVALID_QR', 400);

    const registration = await tx.registration.findUnique({
      where: { studentId_eventId: { studentId: student.id, eventId } }
    });
    if (!registration) throw new AppError('NOT_REGISTERED', 400);

    const existing = await tx.attendance.findUnique({
      where: { studentId_eventId: { studentId: student.id, eventId } }
    });
    if (existing) throw new AppError('ALREADY_ATTENDED', 400);

    const attendance = await tx.attendance.create({
      data: {
        eventId,
        studentId: student.id,
        registrationId: registration.id,
        scannedById,
        status: 'PRESENT'
      }
    });

    return {
      name: student.name,
      rollNo: student.rollNo,
      status: attendance.status,
      checkInTime: attendance.checkInTime
    };
  });
};

export const getEventAttendance = async (eventId, userId) => {
  const registrations = await prisma.registration.findMany({
    where: { eventId },
    include: {
      student: { select: { id: true, name: true, rollNo: true, email: true } },
      attendance: { where: { eventId } }
    },
    orderBy: { registeredAt: 'asc' }
  });

  return registrations.map(reg => {
    const att = reg.attendance && reg.attendance.length > 0 ? reg.attendance[0] : null;
    return {
      registrationId: reg.id,
      studentId: reg.student.id,
      studentName: reg.student.name,
      rollNo: reg.student.rollNo,
      email: reg.student.email,
      registrationStatus: reg.status,
      attendanceStatus: att ? 'PRESENT' : 'ABSENT',
      checkInTime: att ? att.checkInTime : null,
      scannedById: att ? att.scannedById : null
    };
  });
};
