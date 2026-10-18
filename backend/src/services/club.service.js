import bcrypt from 'bcrypt';
import prisma from '../config/database.js';
import { AppError } from '../middleware/error.middleware.js';
import { generateQrToken } from './qr.service.js';
import { generateToken } from '../utils/jwt.js';

export const listClubs = async ({ search, status = 'ACTIVE' } = {}) => {
  const where = {
    status
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }

  const clubs = await prisma.club.findMany({
    where,
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: {
          events: true,
          members: true
        }
      }
    }
  });

  return clubs;
};

export const getClubById = async (clubId) => {
  const club = await prisma.club.findUnique({
    where: { id: clubId },
    include: {
      events: {
        where: { status: 'PUBLISHED' },
        orderBy: { eventDate: 'asc' },
        include: {
          venue: true,
          _count: { select: { registrations: true } }
        }
      },
      notices: {
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        take: 5
      },
      _count: {
        select: {
          members: true,
          events: true
        }
      }
    }
  });

  if (!club) {
    throw new AppError('Club not found', 404);
  }

  return club;
};

export const createClub = async (data, currentUser = null) => {
  const existing = await prisma.club.findFirst({
    where: { name: { equals: data.name, mode: 'insensitive' } }
  });

  if (existing) {
    throw new AppError('A club with this name already exists', 400);
  }

  // Scenario 1: Authenticated user creates a club
  if (currentUser) {
    const club = await prisma.$transaction(async (tx) => {
      const newClub = await tx.club.create({
        data: {
          name: data.name.trim(),
          description: data.description?.trim() || null,
          logoUrl: data.logoUrl || null,
          status: 'ACTIVE'
        }
      });

      await tx.clubMember.create({
        data: {
          clubId: newClub.id,
          userId: currentUser.id,
          role: 'ADMIN'
        }
      });

      if (currentUser.role === 'STUDENT') {
        await tx.user.update({
          where: { id: currentUser.id },
          data: { role: 'CLUB_MEMBER' }
        });
      }

      return newClub;
    });

    return { club, isNewUser: false };
  }

  // Scenario 2: Public registration of a new club with lead credentials
  if (!data.leadName || !data.leadEmail || !data.leadPassword) {
    throw new AppError('Lead organizer name, email, and password are required', 400);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: data.leadEmail.toLowerCase().trim() }
  });

  if (existingUser) {
    throw new AppError('An account with this lead email already exists. Please log in first.', 409);
  }

  const hashedPassword = await bcrypt.hash(data.leadPassword, 10);
  const qrToken = generateQrToken();
  const rollNo = data.rollNo?.trim() || `CLUB-${data.name.replace(/[^A-Za-z0-9]/g, '').slice(0, 10).toUpperCase()}`;

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: data.leadName.trim(),
        email: data.leadEmail.toLowerCase().trim(),
        password: hashedPassword,
        rollNo,
        qrToken,
        role: 'CLUB_MEMBER'
      }
    });

    const club = await tx.club.create({
      data: {
        name: data.name.trim(),
        description: data.description?.trim() || null,
        logoUrl: data.logoUrl || null,
        status: 'ACTIVE'
      }
    });

    await tx.clubMember.create({
      data: {
        clubId: club.id,
        userId: user.id,
        role: 'ADMIN'
      }
    });

    return { user, club };
  });

  const token = generateToken(result.user.id);
  const userSafe = {
    id: result.user.id,
    name: result.user.name,
    email: result.user.email,
    role: result.user.role,
    rollNo: result.user.rollNo,
    qrToken: result.user.qrToken,
    clubId: result.club.id,
    clubName: result.club.name
  };

  return {
    club: result.club,
    user: userSafe,
    token,
    isNewUser: true
  };
};
