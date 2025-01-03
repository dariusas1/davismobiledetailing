class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message) {
        super(message, 400);
        this.name = 'ValidationError';
        this.validationErrors = [];
    }

    addError(field, message) {
        this.validationErrors.push({ field, message });
    }
}

class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed') {
        super(message, 401);
        this.name = 'AuthenticationError';
    }
}

class AuthorizationError extends AppError {
    constructor(message = 'Not authorized to access this resource') {
        super(message, 403);
        this.name = 'AuthorizationError';
    }
}

class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404);
        this.name = 'NotFoundError';
    }
}

// Async handler wrapper to eliminate try-catch blocks
export const handleAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }

    // Production error handling
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }

    // Programming or unknown errors
    console.error('ERROR 💥', err);
    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong'
    });
};

// Handle specific error types
export const handleErrors = (err) => {
    if (err.name === 'CastError') {
        return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return new AppError(`Duplicate field value: ${field}. Please use another value`, 400);
    }

    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(val => val.message);
        return new AppError(`Invalid input data: ${errors.join('. ')}`, 400);
    }

    if (err.name === 'JsonWebTokenError') {
        return new AppError('Invalid token. Please log in again', 401);
    }

    if (err.name === 'TokenExpiredError') {
        return new AppError('Token expired. Please log in again', 401);
    }

    return err;
};

// Rate limiting error handler
export const handleTooManyRequests = (req, res) => {
    res.status(429).json({
        status: 'error',
        message: 'Too many requests from this IP, please try again later'
    });
};

// Handle uncaught exceptions
process.on('uncaughtException', err => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message, err.stack);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});

export {
    AppError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError
}; 