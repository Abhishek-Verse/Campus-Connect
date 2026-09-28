export const sendSuccess = (res, data, statusCode = 200, meta = null) => {
  const payload = { success: true, data };
  if (meta) payload.meta = meta;
  res.status(statusCode).json(payload);
};

export const sendError = (res, code, message, statusCode = 400) => {
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message
    }
  });
};
