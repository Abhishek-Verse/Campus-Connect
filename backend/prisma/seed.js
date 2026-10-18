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
      name: 'Rotaract Club of TCET (RC-TCET)',
      desc: 'Youth leadership, community development, blood donation drives, and social welfare initiatives',
      email: 'rotaract@campushub.edu',
      nameOfficial: 'Rotaract TCET Official',
      rollNo: 'CLUB-ROTARACT'
    },
    {
      name: 'Green Club TCET',
      desc: 'Campus sustainability, tree plantation drives, environmental awareness, and eco-initiatives',
      email: 'greenclub@campushub.edu',
      nameOfficial: 'Green Club TCET Official',
      rollNo: 'CLUB-GREEN'
    },
    {
      name: 'ISTE TCET (Indian Society for Technical Education)',
      desc: 'Technical symposia, project competitions, national skill workshops, and tech seminars',
      email: 'iste@campushub.edu',
      nameOfficial: 'ISTE TCET Official',
      rollNo: 'CLUB-ISTE'
    },
    {
      name: 'Coding Club',
      desc: 'Technical workshops, hackathons, and competitive programming sprints',
      email: 'codingclub@campushub.edu',
      nameOfficial: 'Coding Club Official',
      rollNo: 'CLUB-CODING'
    },
    {
      name: 'Cultural Club',
      desc: 'Music, drama, dance, fine arts, and annual college festivals (Tarangan & Garba-Verse)',
      email: 'culturalclub@campushub.edu',
      nameOfficial: 'Cultural Club Official',
      rollNo: 'CLUB-CULTURAL'
    },
    {
      name: 'Sports Club',
      desc: 'Inter-college tournaments, athletic meets, cricket leagues, and sports days',
      email: 'sportsclub@campushub.edu',
      nameOfficial: 'Sports Club Official',
      rollNo: 'CLUB-SPORTS'
    },
    {
      name: 'E-Cell TCET (Entrepreneurship Cell)',
      desc: 'Startup incubations, business pitch competitions, venture summits, and founder talks',
      email: 'ecell@campushub.edu',
      nameOfficial: 'E-Cell TCET Official',
      rollNo: 'CLUB-ECELL'
    },
    {
      name: 'ACM Student Chapter TCET',
      desc: 'Algorithms, scientific computing, system design bootcamps, and global programming contests',
      email: 'acm@campushub.edu',
      nameOfficial: 'ACM TCET Official',
      rollNo: 'CLUB-ACM'
    },
    {
      name: 'IEEE TCET Student Branch',
      desc: 'Hardware prototyping, robotics, IoT research, embedded systems, and conference publications',
      email: 'ieee@campushub.edu',
      nameOfficial: 'IEEE TCET Official',
      rollNo: 'CLUB-IEEE'
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
