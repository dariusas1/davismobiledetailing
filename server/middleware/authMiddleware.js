import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';
import logger from '../config/logger.js';
import { UnauthorizedError, ForbiddenError } from './errorHandler.js';

class AuthMiddleware {
    // Token generation
    generateToken(user) {
        return jwt.sign(
            { 
                id: user._id, 
                email: user.email, 
                role: user.role 
            }, 
            process.env.JWT_SECRET, 
            { 
                expiresIn: '24h' 
            }
        );
    }

    // User authentication middleware
    authenticateUser = async (req, res, next) => {
        // Check for token in headers
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Extract token from Bearer scheme
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Invalid token format' });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check if user exists
            const user = await User.findById(decoded.id).select('-password');
            
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            // Attach user to request
            req.user = {
                id: user._id,
                email: user.email,
                role: user.role,
                mustChangePassword: user.mustChangePassword
            };

            // Check for admin-only routes
            if (req.path.includes('/admin') && user.role !== 'admin') {
                return res.status(403).json({ message: 'Access denied' });
            }

            // Force password change if required
            if (user.mustChangePassword && req.path !== '/change-password') {
                return res.status(403).json({ 
                    message: 'Password change required',
                    mustChangePassword: true 
                });
            }

            next();
        } catch (error) {
            // Handle different types of JWT errors
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' });
            }
            
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid token' });
            }

            console.error('Authentication error:', error);
            res.status(500).json({ message: 'Server authentication error' });
        }
    }

    // Role-based authorization
    authorizeRoles = (...allowedRoles) => {
        return (req, res, next) => {
            if (!req.user) {
                throw new UnauthorizedError('Authentication required');
            }

            const hasAuthorizedRole = allowedRoles.includes(req.user.role);

            if (!hasAuthorizedRole) {
                logger.warn('Unauthorized access attempt', {
                    userId: req.user._id,
                    requiredRoles: allowedRoles,
                    userRole: req.user.role
                });

                throw new ForbiddenError('Insufficient permissions');
            }

            next();
        };
    }

    // Password management
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    async comparePassword(inputPassword, storedPassword) {
        return bcrypt.compare(inputPassword, storedPassword);
    }

    // Two-factor authentication setup
    async setupTwoFactorAuth(user) {
        // Generate and store 2FA secret
        const secret = speakeasy.generateSecret();
        
        user.twoFactorSecret = secret.base32;
        await user.save();

        return {
            secret: secret.base32,
            qrCode: secret.otpauth_url
        };
    }

    // Verify two-factor authentication token
    async verifyTwoFactorToken(user, token) {
        return speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: token
        });
    }

    // Account lockout mechanism
    async handleFailedLogin(email) {
        const user = await User.findOne({ email });
        
        if (user) {
            user.loginAttempts += 1;
            
            if (user.loginAttempts >= 5) {
                user.lockUntil = Date.now() + (15 * 60 * 1000); // 15 minutes
            }

            await user.save();
        }
    }

    // Check if account is locked
    async isAccountLocked(email) {
        const user = await User.findOne({ email });
        
        if (user && user.lockUntil > Date.now()) {
            return true;
        }

        // Reset login attempts if lockout period has passed
        if (user && user.lockUntil < Date.now()) {
            user.loginAttempts = 0;
            user.lockUntil = undefined;
            await user.save();
        }

        return false;
    }
}

// Create a single instance of AuthMiddleware
const authMiddleware = new AuthMiddleware();

// Export the methods
export const {
    authenticateUser,
    authorizeRoles,
    generateToken,
    hashPassword,
    comparePassword,
    setupTwoFactorAuth,
    verifyTwoFactorToken,
    handleFailedLogin,
    isAccountLocked
} = authMiddleware;
