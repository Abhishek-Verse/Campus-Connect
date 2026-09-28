export class AppError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      details: err.details
    });
  }

  if (err.code === 'P2002') {
    return res.status(400).json({
      success: false,
      error: 'Unique constraint violation',
      details: err.meta?.target
    });
  }

  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
};
