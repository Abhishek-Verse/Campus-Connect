import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  password: z.string().min(6).max(255),
  rollNo: z.string().min(2).max(50),
  role: z.string().optional().transform(r => r ? r.toUpperCase() : 'STUDENT'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
