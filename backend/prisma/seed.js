import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const prisma = new PrismaClient();
const genQr = () => 'CH-' + crypto.randomBytes(4).toString('hex').toUpperCase();

async function main() {
  const pw = await bcrypt.hash('password123', 10);
  
  // Students
  const s1 = await prisma.user.create({ data: { name: 'Rahul Sharma', email: 'rahul@test.com', password: pw, rollNo: '101', qrToken: genQr(), role: 'STUDENT' }});
  const s2 = await prisma.user.create({ data: { name: 'Priya Patel', email: 'priya@test.com', password: pw, rollNo: '102', qrToken: genQr(), role: 'STUDENT' }});
  const s3 = await prisma.user.create({ data: { name: 'Amit Singh', email: 'amit@test.com', password: pw, rollNo: '103', qrToken: genQr(), role: 'STUDENT' }});
  const s4 = await prisma.user.create({ data: { name: 'Neha Gupta', email: 'neha@test.com', password: pw, rollNo: '104', qrToken: genQr(), role: 'STUDENT' }});
  const s5 = await prisma.user.create({ data: { name: 'Vikram Reddy', email: 'vikram@test.com', password: pw, rollNo: '105', qrToken: genQr(), role: 'STUDENT' }});

  // Clubs
  const c1 = await prisma.club.create({ data: { name: 'Coding Club', description: 'Tech events' }});
  const c2 = await prisma.club.create({ data: { name: 'Cultural Club', description: 'Cultural events' }});

  // Club Members
  await prisma.clubMember.createMany({ data: [
    { clubId: c1.id, userId: s1.id, role: 'PRESIDENT' },
    { clubId: c1.id, userId: s2.id, role: 'MEMBER' },
    { clubId: c2.id, userId: s3.id, role: 'SECRETARY' },
    { clubId: c2.id, userId: s4.id, role: 'MEMBER' },
    { clubId: c2.id, userId: s5.id, role: 'MEMBER' }
  ]});

  // Venues
  const v1 = await prisma.venue.create({ data: { name: 'Auditorium', capacity: 500 }});
  const v2 = await prisma.venue.create({ data: { name: 'Lab 1', capacity: 60 }});
  const v3 = await prisma.venue.create({ data: { name: 'Seminar Hall', capacity: 150 }});

  // Events
  const e1 = await prisma.event.create({ data: { title: 'Hackathon 2024', clubId: c1.id, venueId: v2.id, eventDate: new Date(), startTime: '10:00', endTime: '18:00', capacity: 50, status: 'PUBLISHED' }});
  const e2 = await prisma.event.create({ data: { title: 'Dance Fest', clubId: c2.id, venueId: v1.id, eventDate: new Date(), startTime: '18:00', endTime: '21:00', capacity: 400, status: 'PUBLISHED' }});
  const e3 = await prisma.event.create({ data: { title: 'Code Workshop', clubId: c1.id, venueId: v2.id, eventDate: new Date(), startTime: '14:00', endTime: '16:00', capacity: 60, status: 'DRAFT' }});
  const e4 = await prisma.event.create({ data: { title: 'Music Night', clubId: c2.id, venueId: v1.id, eventDate: new Date(), startTime: '19:00', endTime: '22:00', capacity: 500, status: 'COMPLETED' }});
  const e5 = await prisma.event.create({ data: { title: 'Tech Talk', clubId: c1.id, venueId: v3.id, eventDate: new Date(), startTime: '11:00', endTime: '13:00', capacity: 100, status: 'PUBLISHED' }});

  // Registrations & Attendance
  const r1 = await prisma.registration.create({ data: { studentId: s1.id, eventId: e1.id }});
  await prisma.attendance.create({ data: { eventId: e1.id, studentId: s1.id, registrationId: r1.id, scannedById: s2.id }});

  // Notices
  await prisma.notice.create({ data: { clubId: c1.id, title: 'Hackathon Rescheduled', content: 'Timing changed' }});
}
main().catch(console.error).finally(() => prisma.$disconnect());
