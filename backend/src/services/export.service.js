import ExcelJS from 'exceljs';
import prisma from '../config/database.js';

export const exportAttendance = async (eventId, format = 'xlsx') => {
  const registrations = await prisma.registration.findMany({
    where: { eventId },
    include: {
      student: true,
      attendance: true
    },
    orderBy: { student: { rollNo: 'asc' } }
  });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Attendance');

  worksheet.columns = [
    { header: 'Roll No', key: 'rollNo', width: 14 },
    { header: 'ERP ID', key: 'erpId', width: 16 },
    { header: 'Student Name', key: 'name', width: 28 },
    { header: 'GSuite Email', key: 'email', width: 32 },
    { header: 'Department', key: 'department', width: 24 },
    { header: 'Division', key: 'division', width: 12 },
    { header: 'Gender', key: 'gender', width: 12 },
    { header: 'Admission Year', key: 'admissionYear', width: 16 },
    { header: 'Passing Year', key: 'passingYear', width: 16 },
    { header: 'College', key: 'college', width: 26 },
    { header: 'Registration Status', key: 'regStatus', width: 20 },
    { header: 'Attendance Status', key: 'attStatus', width: 20 },
    { header: 'Check-in Time', key: 'time', width: 24 },
  ];

  // Header styling
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1E40AF' }
  };
  headerRow.height = 24;

  registrations.forEach(reg => {
    const attended = reg.attendance.length > 0;
    const checkInTimeStr = attended && reg.attendance[0].checkInTime 
      ? new Date(reg.attendance[0].checkInTime).toLocaleString('en-IN') 
      : '-';

    const row = worksheet.addRow({
      rollNo: reg.student.rollNo || '-',
      erpId: reg.student.erpId || '-',
      name: reg.student.name || '-',
      email: reg.student.email || '-',
      department: reg.student.department || '-',
      division: reg.student.division || '-',
      gender: reg.student.gender || '-',
      admissionYear: reg.student.admissionYear || '-',
      passingYear: reg.student.passingYear || '-',
      college: reg.student.college || '-',
      regStatus: reg.status,
      attStatus: attended ? 'PRESENT' : 'ABSENT',
      time: checkInTimeStr,
    });

    if (attended) {
      row.getCell('attStatus').font = { color: { argb: 'FF16A34A' }, bold: true };
    } else {
      row.getCell('attStatus').font = { color: { argb: 'FFDC2626' } };
    }
  });

  if (format === 'csv') {
    const csvBuffer = await workbook.csv.writeBuffer();
    return { buffer: csvBuffer, filename: `attendance-${eventId}.csv`, contentType: 'text/csv' };
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return { buffer, filename: `attendance-${eventId}.xlsx`, contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
};
