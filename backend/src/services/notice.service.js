import prisma from '../config/database.js';

export const listNotices = async (filters) => {
  return prisma.notice.findMany({ where: filters, include: { club: true } });
};

export const createNotice = async (data) => {
  return prisma.notice.create({ data });
};

export const updateNotice = async (noticeId, data) => {
  return prisma.notice.update({ where: { id: noticeId }, data });
};

export const deleteNotice = async (noticeId) => {
  return prisma.notice.delete({ where: { id: noticeId } });
};
