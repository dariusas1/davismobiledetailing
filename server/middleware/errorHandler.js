import logger from '../config/logger.js';

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
  }
}

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
    this.status = 401;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenError';
    this.status = 403;
  }
}

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof ValidationError || 
      err instanceof NotFoundError || 
      err instanceof AuthenticationError ||
      err instanceof ForbiddenError) {
    return res.status(err.status).json({
      error: err.name,
      message: err.message
    });
  }

  res.status(500).json({
    error: 'InternalServerError',
    message: 'An unexpected error occurred'
  });
};

export {
  ValidationError,
  NotFoundError,
  AuthenticationError,
  ForbiddenError,
  errorHandler
};
