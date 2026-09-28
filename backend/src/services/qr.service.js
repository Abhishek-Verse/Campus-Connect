import crypto from 'crypto';

export const generateQrToken = () => {
  const hex = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `CH-${hex}`;
};
