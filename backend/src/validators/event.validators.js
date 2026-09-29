import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().optional().default(''),
  category: z.string().optional().default('OTHER'),
  eventDate: z.string().optional(),
  date: z.string().optional(),
  startTime: z.string().optional().default('10:00'),
  endTime: z.string().optional().default('12:00'),
  capacity: z.coerce.number().int().positive().default(50),
  posterUrl: z.string().optional().nullable().transform(v => v ? v : null),
  guestName: z.string().optional().nullable(),
  guest: z.string().optional().nullable(),
  registrationDeadline: z.string().optional().nullable(),
  deadline: z.string().optional().nullable(),
  rules: z.union([z.array(z.string()), z.string()]).optional().default([]),
  venueId: z.string().optional().nullable(),
  venue: z.string().optional().nullable(),
  status: z.string().optional().default('DRAFT'),
  clubId: z.string().optional()
}).refine(data => data.eventDate || data.date, {
  message: 'Event date is required'
}).transform(data => ({
  ...data,
  eventDate: data.eventDate || data.date,
  registrationDeadline: data.registrationDeadline || data.deadline || null,
  guestName: data.guestName || data.guest || null
}));

export const updateEventSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  eventDate: z.string().optional().nullable(),
  date: z.string().optional().nullable(),
  startTime: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
  capacity: z.coerce.number().int().positive().optional(),
  posterUrl: z.string().optional().nullable(),
  guestName: z.string().optional().nullable(),
  guest: z.string().optional().nullable(),
  registrationDeadline: z.string().optional().nullable(),
  deadline: z.string().optional().nullable(),
  rules: z.union([z.array(z.string()), z.string()]).optional().nullable(),
  venueId: z.string().optional().nullable(),
  venue: z.string().optional().nullable(),
  status: z.string().optional().nullable()
});
