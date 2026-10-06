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
    const targets = Array.isArray(err.meta?.target) ? err.meta.target : [err.meta?.target];
    let msg = 'Unique constraint violation';
    if (targets.some(t => String(t).includes('email'))) {
      msg = 'An account with this email address already exists.';
    } else if (targets.some(t => String(t).includes('erp'))) {
      msg = 'An account with this ERP ID already exists.';
    }
    return res.status(400).json({
      success: false,
      error: msg,
      details: err.meta?.target
    });
  }

  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
};
