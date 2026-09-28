import { z } from 'zod';

export const createNoticeSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(1),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH']).optional(),
  eventId: z.string().uuid().optional(),
});

export const updateNoticeSchema = createNoticeSchema.partial();
