import { z } from 'zod';

export const scanSchema = z.object({
  qrToken: z.string().min(1).optional(),
  qrCode: z.string().min(1).optional(),
}).refine(data => data.qrToken || data.qrCode, {
  message: 'qrToken or qrCode is required',
}).transform(data => ({
  qrToken: (data.qrToken || data.qrCode).trim(),
}));
