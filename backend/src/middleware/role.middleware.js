import { AppError } from './error.middleware.js';
import prisma from '../config/database.js';

export const requireRole = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      
      if (roles.includes(req.user.role)) {
        return next();
      }

      if (roles.includes('CLUB_MEMBER')) {
        const memberships = await prisma.clubMember.findMany({
          where: { userId: req.user.id }
        });
        if (memberships.length > 0) {
          req.user.clubMemberships = memberships;
          return next();
        }
      }

      throw new AppError('Forbidden: Insufficient permissions', 403);
    } catch (error) {
      next(error);
    }
  };
};
