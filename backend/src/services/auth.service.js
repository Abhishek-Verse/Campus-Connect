import bcrypt from 'bcrypt';
import prisma from '../config/database.js';
import { generateQrToken } from './qr.service.js';
import { generateToken } from '../utils/jwt.js';
import { AppError } from '../middleware/error.middleware.js';

export const register = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const qrToken = generateQrToken();
  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
      qrToken,
    },
  });
  const token = generateToken(user.id);
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      rollNo: user.rollNo,
      erpId: user.erpId,
      admissionYear: user.admissionYear,
      passingYear: user.passingYear,
      gender: user.gender,
      department: user.department,
      college: user.college,
      division: user.division,
      role: user.role,
      qrToken: user.qrToken,
      isClubMember: user.role === 'CLUB_MEMBER' || user.role === 'ADMIN'
    }
  };
};

export const login = async (identifier, password) => {
  const cleanEmail = (identifier || '').trim();
  const user = await prisma.user.findFirst({
    where: {
      email: { equals: cleanEmail, mode: 'insensitive' }
    },
    include: {
      clubMemberships: {
        include: { club: true }
      }
    }
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = generateToken(user.id);
  const isClubMember = user.role === 'CLUB_MEMBER' || user.role === 'ADMIN';
  const effectiveRole = user.role;

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      rollNo: user.rollNo,
      erpId: user.erpId,
      admissionYear: user.admissionYear,
      passingYear: user.passingYear,
      gender: user.gender,
      department: user.department,
      college: user.college,
      division: user.division,
      role: effectiveRole,
      isClubMember,
      qrToken: user.qrToken,
      clubMemberships: user.clubMemberships
    }
  };
};

export const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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
      qrToken: true,
      clubMemberships: { include: { club: true } }
    },
  });
  if (!user) throw new AppError('User not found', 404);
  const isClubMember = (user.clubMemberships && user.clubMemberships.length > 0) || user.role === 'CLUB_MEMBER' || user.role === 'ADMIN';
  return {
    ...user,
    isClubMember
  };
};
