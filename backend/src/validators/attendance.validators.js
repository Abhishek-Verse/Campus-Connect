import { z } from 'zod';

export const scanSchema = z.object({
  qrToken: z.string().min(1),
});
