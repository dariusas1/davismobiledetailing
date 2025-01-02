const { ValidationError } = require('../utils/errorHandler');
const {
    validateService,
    validateBooking,
    validateVehicle
} = require('../utils/validation');

// Validation middleware factory
exports.validateRequest = (type) => {
    return (req, res, next) => {
        let validationResult;

        switch (type) {
            case 'service':
                validationResult = validateService(req.body);
                break;
            case 'booking':
                validationResult = validateBooking(req.body);
                break;
            case 'vehicle':
                validationResult = validateVehicle(req.body);
                break;
            default:
                return next(new ValidationError('Invalid validation type'));
        }

        if (validationResult.error) {
            const error = new ValidationError('Validation failed');
            validationResult.error.details.forEach(detail => {
                error.addError(detail.path[0], detail.message);
            });
            return next(error);
        }

        // Replace request body with validated and sanitized data
        req.body = validationResult.value;
        next();
    };
};

// Validate query parameters
exports.validateQuery = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.query, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const validationError = new ValidationError('Invalid query parameters');
            error.details.forEach(detail => {
                validationError.addError(detail.path[0], detail.message);
            });
            return next(validationError);
        }

        req.query = value;
        next();
    };
};

// Validate URL parameters
exports.validateParams = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.params, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const validationError = new ValidationError('Invalid URL parameters');
            error.details.forEach(detail => {
                validationError.addError(detail.path[0], detail.message);
            });
            return next(validationError);
        }

        req.params = value;
        next();
    };
};

// Validate file uploads
exports.validateFile = (options = {}) => {
    const {
        maxSize = 5 * 1024 * 1024, // 5MB default
        allowedTypes = ['image/jpeg', 'image/png'],
        maxFiles = 1
    } = options;

    return (req, res, next) => {
        if (!req.files || Object.keys(req.files).length === 0) {
            return next(new ValidationError('No files were uploaded'));
        }

        const files = Array.isArray(req.files.files)
            ? req.files.files
            : [req.files.files];

        if (files.length > maxFiles) {
            return next(new ValidationError(`Maximum ${maxFiles} files allowed`));
        }

        const validationError = new ValidationError('File validation failed');
        let hasError = false;

        files.forEach(file => {
            if (file.size > maxSize) {
                validationError.addError(file.name, `File size exceeds ${maxSize / 1024 / 1024}MB limit`);
                hasError = true;
            }

            if (!allowedTypes.includes(file.mimetype)) {
                validationError.addError(file.name, `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
                hasError = true;
            }
        });

        if (hasError) {
            return next(validationError);
        }

        next();
    };
};

// Sanitize HTML content
exports.sanitizeHtml = (fields) => {
    return (req, res, next) => {
        const createDOMPurify = require('dompurify');
        const { JSDOM } = require('jsdom');
        const window = new JSDOM('').window;
        const DOMPurify = createDOMPurify(window);

        fields.forEach(field => {
            if (req.body[field]) {
                req.body[field] = DOMPurify.sanitize(req.body[field]);
            }
        });

        next();
    };
};

// Validate date ranges
exports.validateDateRange = (startField, endField) => {
    return (req, res, next) => {
        const startDate = new Date(req.body[startField]);
        const endDate = new Date(req.body[endField]);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return next(new ValidationError('Invalid date format'));
        }

        if (startDate > endDate) {
            return next(new ValidationError('Start date must be before end date'));
        }

        next();
    };
};

// Validate array length
exports.validateArrayLength = (field, { min, max }) => {
    return (req, res, next) => {
        const array = req.body[field];

        if (!Array.isArray(array)) {
            return next(new ValidationError(`${field} must be an array`));
        }

        if (min !== undefined && array.length < min) {
            return next(new ValidationError(`${field} must contain at least ${min} items`));
        }

        if (max !== undefined && array.length > max) {
            return next(new ValidationError(`${field} cannot contain more than ${max} items`));
        }

        next();
    };
}; 