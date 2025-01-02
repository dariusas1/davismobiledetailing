const jwt = require('jsonwebtoken');
const { AuthenticationError, AuthorizationError } = require('../utils/errorHandler');
const User = require('../models/User');

// Authenticate JWT token
exports.authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AuthenticationError('No token provided');
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if user still exists
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            throw new AuthenticationError('User no longer exists');
        }

        // Check if user changed password after token was issued
        if (user.passwordChangedAt && decoded.iat < user.passwordChangedAt.getTime() / 1000) {
            throw new AuthenticationError('User recently changed password. Please log in again');
        }

        // Add user to request
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return next(new AuthenticationError('Invalid token'));
        }
        if (error.name === 'TokenExpiredError') {
            return next(new AuthenticationError('Token expired'));
        }
        next(error);
    }
};

// Authorize roles
exports.authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AuthorizationError('Not authorized to access this route'));
        }
        next();
    };
};

// Check ownership
exports.checkOwnership = (model) => {
    return async (req, res, next) => {
        try {
            const doc = await model.findById(req.params.id);
            if (!doc) {
                return next(new Error('Document not found'));
            }

            // Check if user owns the document or is an admin
            if (doc.user.toString() !== req.user.id && req.user.role !== 'admin') {
                return next(new AuthorizationError('Not authorized to access this document'));
            }

            req.doc = doc;
            next();
        } catch (error) {
            next(error);
        }
    };
};

// Rate limiting
exports.rateLimit = (limit, windowMs) => {
    const rateLimit = require('express-rate-limit');
    
    return rateLimit({
        max: limit, // Limit each IP to {limit} requests per windowMs
        windowMs, // Time window in milliseconds
        message: 'Too many requests from this IP, please try again later',
        handler: (req, res) => {
            res.status(429).json({
                status: 'error',
                message: 'Too many requests from this IP, please try again later'
            });
        }
    });
};

// API key authentication
exports.apiKeyAuth = async (req, res, next) => {
    try {
        const apiKey = req.headers['x-api-key'];
        if (!apiKey) {
            throw new AuthenticationError('API key is required');
        }

        // Verify API key
        const user = await User.findOne({ apiKey });
        if (!user) {
            throw new AuthenticationError('Invalid API key');
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

// Session authentication
exports.sessionAuth = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return next(new AuthenticationError('Please log in'));
    }
    next();
};

// Two-factor authentication
exports.require2FA = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.requires2FA && !user.is2FAVerified) {
            return next(new AuthenticationError('2FA verification required'));
        }
        next();
    } catch (error) {
        next(error);
    }
};

// Refresh token
exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            throw new AuthenticationError('Refresh token is required');
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new AuthenticationError('Invalid refresh token');
        }

        // Generate new access token
        const accessToken = user.generateAccessToken();

        res.json({
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

// Logout
exports.logout = (req, res, next) => {
    try {
        // Clear session if using session-based auth
        if (req.session) {
            req.session.destroy();
        }

        // Clear HTTP-only cookies if using cookie-based auth
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
}; 