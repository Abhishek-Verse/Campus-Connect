import { z } from 'zod';

export const createClubSchema = z.object({
  name: z.string().min(2, 'Club name must be at least 2 characters').max(150),
  description: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  // Fields for self-registration of a club with organizer account:
  leadName: z.string().min(2, 'Lead name must be at least 2 characters').max(100).optional(),
  leadEmail: z.string().email('Please enter a valid email address').max(255).optional(),
  leadPassword: z.string().min(6, 'Password must be at least 6 characters').optional(),
  rollNo: z.string().optional()
});

export const updateClubSchema = z.object({
  name: z.string().min(2, 'Club name must be at least 2 characters').max(150).optional(),
  description: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional()
});
