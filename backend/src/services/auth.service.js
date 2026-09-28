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
  return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
};

export const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Invalid credentials', 401);
  }
  const token = generateToken(user.id);
  return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
};

export const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, rollNo: true, role: true, qrToken: true },
  });
  if (!user) throw new AppError('User not found', 404);
  return user;
};
