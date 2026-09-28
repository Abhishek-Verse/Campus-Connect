import * as eventService from '../services/event.service.js';
import { sendSuccess } from '../utils/response.js';

export const list = async (req, res, next) => {
  try {
    const data = await eventService.listPublishedEvents();
    sendSuccess(res, data);
  } catch (err) { next(err); }
};

export const get = async (req, res, next) => {
  try {
    const data = await eventService.getEventById(req.params.eventId);
    sendSuccess(res, data);
  } catch (err) { next(err); }
};

export const create = async (req, res, next) => {
  try {
    const clubId = req.user.clubMemberships?.[0]?.clubId;
    if (!clubId) throw new Error('Not part of a club');
    const data = await eventService.createEvent(clubId, req.body);
    sendSuccess(res, data, 201);
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const data = await eventService.updateEvent(req.params.eventId, req.user.id, req.body);
    sendSuccess(res, data);
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    await eventService.deleteEvent(req.params.eventId, req.user.id);
    sendSuccess(res, null);
  } catch (err) { next(err); }
};

export const publish = async (req, res, next) => {
  try {
    const data = await eventService.publishEvent(req.params.eventId, req.user.id);
    sendSuccess(res, data);
  } catch (err) { next(err); }
};

export const cancel = async (req, res, next) => {
  try {
    const data = await eventService.cancelEvent(req.params.eventId, req.user.id);
    sendSuccess(res, data);
  } catch (err) { next(err); }
};
