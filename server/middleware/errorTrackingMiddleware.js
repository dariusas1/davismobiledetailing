const winston = require('winston');
const { v4: uuidv4 } = require('uuid');

class ErrorTrackingMiddleware {
    constructor() {
        // Configure error logging
        this.errorLogger = winston.createLogger({
            level: 'error',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: [
                // Log errors to file
                new winston.transports.File({ 
                    filename: 'logs/error.log',
                    maxsize: 5242880, // 5MB
                    maxFiles: 5
                }),
                // Log to console for development
                new winston.transports.Console({
                    format: winston.format.simple()
                })
            ]
        });
    }

    // Middleware to log and track errors
    trackError = (err, req, res, next) => {
        const errorId = uuidv4();
        
        // Detailed error logging
        this.errorLogger.error('Tracked Error', {
            errorId,
            message: err.message,
            stack: err.stack,
            method: req.method,
            path: req.path,
            body: req.body,
            user: req.user ? req.user.id : 'Unauthenticated',
            timestamp: new Date().toISOString()
        });

        // Send error response
        res.status(err.status || 500).json({
            success: false,
            errorId,
            message: err.message || 'Unexpected server error',
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    }

    // Method to log client-side errors
    logClientError = async (errorData) => {
        const errorId = uuidv4();

        this.errorLogger.error('Client-Side Error', {
            errorId,
            ...errorData,
            timestamp: new Date().toISOString()
        });

        return errorId;
    }

    // Performance and error monitoring
    monitorRequest = (req, res, next) => {
        const startTime = Date.now();
        
        // Capture original end method
        const originalEnd = res.end;
        
        res.end = function(...args) {
            const duration = Date.now() - startTime;
            
            // Log slow requests
            if (duration > 1000) {
                this.errorLogger.warn('Slow Request', {
                    method: req.method,
                    path: req.path,
                    duration,
                    timestamp: new Date().toISOString()
                });
            }

            // Call original end method
            originalEnd.apply(this, args);
        }.bind(this);

        next();
    }

    // Rate limiting and abuse prevention
    rateLimit = (options = {}) => {
        const {
            windowMs = 15 * 60 * 1000, // 15 minutes
            max = 100, // limit each IP to 100 requests per windowMs
            message = 'Too many requests, please try again later.'
        } = options;

        const hits = new Map();

        return (req, res, next) => {
            const ip = req.ip;
            const now = Date.now();
            
            // Clean up old hits
            for (const [key, value] of hits.entries()) {
                if (now - value.timestamp > windowMs) {
                    hits.delete(key);
                }
            }

            // Check current IP hits
            const currentHits = hits.get(ip) || { count: 0, timestamp: now };
            
            if (currentHits.count >= max) {
                return res.status(429).json({ 
                    message,
                    retryAfter: Math.ceil((windowMs - (now - currentHits.timestamp)) / 1000)
                });
            }

            // Update hits
            hits.set(ip, {
                count: currentHits.count + 1,
                timestamp: now
            });

            next();
        };
    }
}

module.exports = new ErrorTrackingMiddleware();
