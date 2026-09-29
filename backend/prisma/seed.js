import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const prisma = new PrismaClient();
const genQr = () => 'CH-' + crypto.randomBytes(4).toString('hex').toUpperCase();

async function main() {
  const pw = await bcrypt.hash('password123', 10);

  // 1. Initial College Venues
  const venues = [
    { name: 'Auditorium', location: 'Main Building, Ground Floor', capacity: 500 },
    { name: 'Seminar Hall', location: 'Academic Block A, 2nd Floor', capacity: 150 },
    { name: 'Computer Lab 1', location: 'IT Wing, 3rd Floor', capacity: 80 },
    { name: 'Campus Ground / Amphitheatre', location: 'Outdoor Campus Area', capacity: 1000 }
  ];

  for (const v of venues) {
    const existing = await prisma.venue.findFirst({ where: { name: v.name } });
    if (!existing) {
      await prisma.venue.create({ data: v });
    }
  }

  // 2. Official College Clubs & Organizers
  const clubs = [
    {
      name: 'Coding Club',
      desc: 'Technical workshops, hackathons, and coding competitions',
      email: 'codingclub@campushub.edu',
      nameOfficial: 'Coding Club Official',
      rollNo: 'CLUB-CODING'
    },
    {
      name: 'Cultural Club',
      desc: 'Music, drama, art, and cultural college festivals',
      email: 'culturalclub@campushub.edu',
      nameOfficial: 'Cultural Club Official',
      rollNo: 'CLUB-CULTURAL'
    },
    {
      name: 'Sports Club',
      desc: 'Inter-college tournaments, athletic meets, and campus sports',
      email: 'sportsclub@campushub.edu',
      nameOfficial: 'Sports Club Official',
      rollNo: 'CLUB-SPORTS'
    }
  ];

  for (const c of clubs) {
    let club = await prisma.club.findFirst({ where: { name: c.name } });
    if (!club) {
      club = await prisma.club.create({
        data: { name: c.name, description: c.desc, status: 'ACTIVE' }
      });
    }

    let user = await prisma.user.findUnique({ where: { email: c.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: c.nameOfficial,
          email: c.email,
          password: pw,
          rollNo: c.rollNo,
          qrToken: genQr(),
          role: 'CLUB_MEMBER'
        }
      });
    }

    const membership = await prisma.clubMember.findUnique({
      where: { clubId_userId: { clubId: club.id, userId: user.id } }
    });
    if (!membership) {
      await prisma.clubMember.create({
        data: { clubId: club.id, userId: user.id, role: 'ADMIN' }
      });
    }
  }

  console.log('Seed completed: College clubs, official accounts, and venues initialized.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
