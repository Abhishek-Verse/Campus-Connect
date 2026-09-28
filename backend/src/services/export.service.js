import ExcelJS from 'exceljs';
import prisma from '../config/database.js';

export const exportAttendance = async (eventId, format = 'xlsx') => {
  const registrations = await prisma.registration.findMany({
    where: { eventId },
    include: {
      student: true,
      attendance: true
    }
  });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Attendance');

  worksheet.columns = [
    { header: 'Roll No', key: 'rollNo', width: 15 },
    { header: 'Name', key: 'name', width: 30 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Registration Status', key: 'regStatus', width: 20 },
    { header: 'Attendance Status', key: 'attStatus', width: 20 },
    { header: 'Check-in Time', key: 'time', width: 25 },
  ];

  registrations.forEach(reg => {
    const attended = reg.attendance.length > 0;
    worksheet.addRow({
      rollNo: reg.student.rollNo,
      name: reg.student.name,
      email: reg.student.email,
      regStatus: reg.status,
      attStatus: attended ? 'PRESENT' : 'ABSENT',
      time: attended ? reg.attendance[0].checkInTime.toISOString() : '-',
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return { buffer, filename: `attendance-${eventId}.xlsx`, contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
};
