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

export const updateMeProfile = async (req, res, next) => {
  try {
    const { 
      name, 
      rollNo,
      erpId, 
      admissionYear, 
      passingYear, 
      gender, 
      department, 
      college, 
      division 
    } = req.body;

    const data = {};
    if (name !== undefined) data.name = name.trim();
    if (rollNo !== undefined && rollNo.trim()) data.rollNo = rollNo.trim();
    if (erpId !== undefined) data.erpId = erpId ? erpId.trim() : null;
    if (admissionYear !== undefined) data.admissionYear = admissionYear ? admissionYear.trim() : null;
    if (passingYear !== undefined) data.passingYear = passingYear ? passingYear.trim() : null;
    if (gender !== undefined) data.gender = gender ? gender.trim() : null;
    if (department !== undefined) data.department = department ? department.trim() : null;
    if (college !== undefined) data.college = college ? college.trim() : null;
    if (division !== undefined) data.division = division ? division.trim().toUpperCase() : null;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: { 
        id: true, 
        name: true, 
        email: true, 
        rollNo: true, 
        erpId: true,
        admissionYear: true,
        passingYear: true,
        gender: true,
        department: true,
        college: true,
        division: true,
        role: true, 
        qrToken: true 
      }
    });
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
    const registrations = await prisma.registration.findMany({
      where: { studentId: req.user.id },
      include: {
        event: {
          include: {
            club: { select: { name: true } },
            venue: { select: { name: true } }
          }
        },
        attendance: true
      },
      orderBy: { event: { eventDate: 'desc' } }
    });

    const now = new Date();
    const data = registrations.map(reg => {
      const isPresent = reg.attendance && reg.attendance.length > 0;
      const eventDate = new Date(reg.event.eventDate);
      const [endH = '23', endM = '59'] = (reg.event.endTime || '23:59').split(':');
      eventDate.setHours(parseInt(endH), parseInt(endM), 59, 999);
      const isPast = eventDate < now;
      const status = isPresent ? 'PRESENT' : (isPast ? 'ABSENT' : 'PENDING');

      return {
        id: reg.id,
        eventId: reg.eventId,
        eventTitle: reg.event.title,
        title: reg.event.title,
        date: reg.event.eventDate,
        eventDate: reg.event.eventDate,
        clubName: reg.event.club?.name || 'General',
        venue: reg.event.venue?.name || 'TBD',
        status,
        attendanceStatus: status,
        checkInTime: isPresent ? reg.attendance[0].checkInTime : null
      };
    });

    sendSuccess(res, data);
  } catch (err) { next(err); }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [registered, attended, upcoming] = await Promise.all([
      prisma.registration.count({ where: { studentId: req.user.id } }),
      prisma.attendance.count({ where: { studentId: req.user.id } }),
      prisma.registration.count({
        where: {
          studentId: req.user.id,
          event: {
            eventDate: { gte: today },
            status: { not: 'CANCELLED' }
          }
        }
      })
    ]);

    sendSuccess(res, { registered, attended, upcoming });
  } catch (err) { next(err); }
};
