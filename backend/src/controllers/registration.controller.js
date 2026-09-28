import * as registrationService from '../services/registration.service.js';
import { sendSuccess } from '../utils/response.js';

export const registerEvent = async (req, res, next) => {
  try {
    const data = await registrationService.registerForEvent(req.user.id, req.params.eventId);
    sendSuccess(res, data, 201);
  } catch (err) { next(err); }
};

export const cancelRegistration = async (req, res, next) => {
  try {
    await registrationService.cancelRegistration(req.user.id, req.params.eventId);
    sendSuccess(res, null);
  } catch (err) { next(err); }
};

export const getMyRegistrations = async (req, res, next) => {
  try {
    const data = await registrationService.getMyRegistrations(req.user.id);
    sendSuccess(res, data);
  } catch (err) { next(err); }
};

export const getEventRegistrations = async (req, res, next) => {
  try {
    const data = await registrationService.getEventRegistrations(req.params.eventId, req.user.id);
    sendSuccess(res, data);
  } catch (err) { next(err); }
};
