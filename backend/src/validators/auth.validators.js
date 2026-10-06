import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid college email').max(255),
  password: z.string().min(6, 'Password must be at least 6 characters').max(255),
  rollNo: z.string().min(1, 'Roll number is required').max(50),
  erpId: z.string().min(1, 'ERP ID is required').max(50).transform(v => v.trim()),
  admissionYear: z.string().optional().nullable().transform(v => v ? v.trim() : null),
  passingYear: z.string().optional().nullable().transform(v => v ? v.trim() : null),
  gender: z.string().optional().nullable().transform(v => v ? v.trim() : null),
  department: z.string().optional().nullable().transform(v => v ? v.trim() : null),
  college: z.string().optional().nullable().transform(v => v ? v.trim() : null),
  division: z.string().optional().nullable().transform(v => v ? v.trim().toUpperCase() : null),
  role: z.string().optional().transform(r => r ? r.toUpperCase() : 'STUDENT'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
