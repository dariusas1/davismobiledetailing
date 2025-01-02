/* eslint-disable no-undef */
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

class SecurityMiddleware {
    // Helmet for setting various HTTP headers
    static helmetProtection() {
        return helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    imgSrc: ["'self'", "data:", "https:"]
                }
            },
            referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
        });
    }

    // CORS configuration
    static corsProtection() {
        return cors({
            origin: process.env.ALLOWED_ORIGINS ? 
                process.env.ALLOWED_ORIGINS.split(',') : 
                ['http://localhost:3000'],
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
            maxAge: 86400 // 24 hours
        });
    }

    // Rate limiting for all routes
    static globalRateLimiter() {
        return rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
            message: 'Too many requests, please try again later',
            standardHeaders: true,
            legacyHeaders: false
        });
    }

    // Route-specific rate limiters
    static authRateLimiter() {
        return rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 5, // limit login attempts
            message: 'Too many login attempts, please try again later'
        });
    }

    // Prevent NoSQL injection
    static preventNoSQLInjection() {
        return mongoSanitize({
            onSanitize: ({ req, key }) => {
                console.warn(`NoSQL Injection attempt detected in ${key}`);
            }
        });
    }

    // Prevent XSS attacks
    static preventXSS() {
        return xss();
    }

    // Prevent HTTP Parameter Pollution
    static preventParameterPollution() {
        return hpp({
            whitelist: [
                'sort', 
                'fields', 
                'page', 
                'limit'
            ]
        });
    }

    // JWT Token Validation Middleware
    static validateJWTToken() {
        return (req, res, next) => {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ 
                    message: 'No token provided' 
                });
            }

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = decoded;
                next();
            } catch (error) {
                return res.status(401).json({ 
                    message: 'Invalid or expired token' 
                });
            }
        };
    }

    // Apply all security middlewares
    static applySecurityMiddlewares(app) {
        app.use(this.helmetProtection());
        app.use(this.corsProtection());
        app.use(this.globalRateLimiter());
        app.use(this.preventNoSQLInjection());
        app.use(this.preventXSS());
        app.use(this.preventParameterPollution());
    }
}

module.exports = SecurityMiddleware;
