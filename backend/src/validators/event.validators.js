import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().optional(),
  category: z.string().optional(),
  eventDate: z.string().datetime(),
  startTime: z.string(),
  endTime: z.string(),
  capacity: z.number().positive(),
  posterUrl: z.string().url().optional(),
  guestName: z.string().optional(),
  registrationDeadline: z.string().datetime().optional(),
  rules: z.array(z.string()).optional(),
  venueId: z.string().uuid().optional(),
});

export const updateEventSchema = createEventSchema.partial();
