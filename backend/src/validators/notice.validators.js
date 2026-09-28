import { z } from 'zod';

export const createNoticeSchema = z.object({
  title: z.string().min(2).max(200),
  content: z.string().min(1),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'IMPORTANT', 'URGENT']).optional().default('NORMAL'),
  eventId: z.string().optional().nullable().transform(v => v && v.trim() ? v : null),
  clubId: z.string().optional().nullable(),
});

export const updateNoticeSchema = createNoticeSchema.partial();
