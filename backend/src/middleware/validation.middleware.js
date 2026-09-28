import { AppError } from './error.middleware.js';

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    next(new AppError('Validation failed', 400, error.errors));
  }
};
