import logger from '../config/logger.js';
import rateLimit from 'express-rate-limit';

const ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    MANAGER: 'manager'
};

// Permissions mapping
const PERMISSIONS = {
    [ROLES.ADMIN]: [
        'read:all',
        'write:all',
        'delete:all',
        'manage:users',
        'access:dashboard'
    ],
    [ROLES.MANAGER]: [
        'read:own',
        'write:own',
        'access:dashboard',
        'manage:bookings'
    ],
    [ROLES.USER]: [
        'read:own',
        'write:own'
    ]
};

// Access control middleware
const accessControl = (requiredPermissions = []) => {
    return (req, res, next) => {
        try {
            // Ensure user is authenticated
            if (!req.user) {
                logger.warn('Unauthorized access attempt', {
                    path: req.path,
                    method: req.method,
                    ip: req.ip
                });
                return res.status(401).json({ 
                    message: 'Authentication required' 
                });
            }

            const userRole = req.user.role || ROLES.USER;
            const userPermissions = PERMISSIONS[userRole] || [];
            const hasPermission = requiredPermissions.every(permission => 
                userPermissions.includes(permission)
            );

            if (!hasPermission) {
                logger.error('Access denied', {
                    user: req.user.id,
                    role: userRole,
                    requiredPermissions,
                    path: req.path
                });

                return res.status(403).json({ 
                    message: 'Access denied',
                    requiredPermissions 
                });
            }

            // Log successful access
            logger.info('Access granted', {
                user: req.user.id,
                role: userRole,
                path: req.path
            });

            next();
        } catch (error) {
            logger.error('Access control error', {
                error: error.message,
                stack: error.stack
            });
            res.status(500).json({ message: 'Internal server error' });
        }
    };
};

// Rate limiting middleware
export const createRateLimiter = (options = {}) => {
    const defaultOptions = {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: 'Too many requests, please try again later',
        standardHeaders: true,
        legacyHeaders: false,
    };

    return rateLimit({ ...defaultOptions, ...options });
};

export default accessControl;
