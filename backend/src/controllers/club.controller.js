import * as clubService from '../services/club.service.js';
import { sendSuccess } from '../utils/response.js';

export const list = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    const clubs = await clubService.listClubs({ search, status });
    sendSuccess(res, clubs);
  } catch (err) {
    next(err);
  }
};

export const get = async (req, res, next) => {
  try {
    const club = await clubService.getClubById(req.params.clubId);
    sendSuccess(res, club);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const result = await clubService.createClub(req.body, req.user);
    sendSuccess(res, result, 201);
  } catch (err) {
    next(err);
  }
};
