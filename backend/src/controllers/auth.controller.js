import * as authService from '../services/auth.service.js';
import { sendSuccess } from '../utils/response.js';

export const register = async (req, res, next) => {
  try {
    const data = await authService.register(req.body);
    sendSuccess(res, data, 201);
  } catch (error) { next(error); }
};

export const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body.email, req.body.password);
    sendSuccess(res, data);
  } catch (error) { next(error); }
};

export const getMe = async (req, res, next) => {
  try {
    const data = await authService.getMe(req.user.id);
    sendSuccess(res, data);
  } catch (error) { next(error); }
};
