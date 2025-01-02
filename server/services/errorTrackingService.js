/* eslint-disable default-case */
const { v4: uuidv4 } = require('uuid');
const { logger } = require('../utils/logger');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const slack = require('slack-notify')(process.env.SLACK_WEBHOOK_URL);

// Error log schema
const ErrorLogSchema = new mongoose.Schema({
    errorId: {
        type: String,
        unique: true,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    stack: String,
    level: {
        type: String,
        enum: ['error', 'warn', 'info'],
        default: 'error'
    },
    context: {
        user: {
            id: String,
            email: String
        },
        request: {
            method: String,
            path: String,
            headers: Object,
            body: Object
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        environment: {
            nodeEnv: String,
            platform: String
        }
    },
    resolved: {
        type: Boolean,
        default: false
    }
});

const ErrorLog = mongoose.model('ErrorLog', ErrorLogSchema);

class ErrorTrackingService {
    // Log and store error
    async logError(error, req = {}, customContext = {}) {
        try {
            const errorLog = new ErrorLog({
                errorId: uuidv4(),
                message: error.message,
                stack: error.stack,
                level: customContext.level || 'error',
                context: {
                    user: {
                        id: req.user?.id,
                        email: req.user?.email
                    },
                    request: {
                        method: req.method,
                        path: req.path,
                        headers: req.headers,
                        body: req.body
                    },
                    environment: {
                        nodeEnv: process.env.NODE_ENV,
                        platform: process.platform
                    },
                    ...customContext
                }
            });

            await errorLog.save();

            // Log to console and file
            logger.error('Error tracked', {
                errorId: errorLog.errorId,
                message: error.message
            });

            return errorLog.errorId;
        } catch (trackingError) {
            logger.error('Error tracking failed', {
                originalError: error.message,
                trackingError: trackingError.message
            });
            return null;
        }
    }

    // Retrieve error by ID
    async getErrorById(errorId) {
        return ErrorLog.findOne({ errorId });
    }

    // Mark error as resolved
    async resolveError(errorId) {
        return ErrorLog.findOneAndUpdate(
            { errorId },
            { resolved: true },
            { new: true }
        );
    }

    // Get unresolved errors
    async getUnresolvedErrors(limit = 50) {
        return ErrorLog.find({ resolved: false })
            .sort({ 'context.timestamp': -1 })
            .limit(limit);
    }

    // Error notification (can be extended to send emails, slack messages, etc.)
    async notifyError(errorId, notificationMethod = 'log') {
        const error = await this.getErrorById(errorId);
        
        if (!error) return;

        switch (notificationMethod) {
            case 'log':
                logger.error('Unresolved Error Notification', {
                    errorId: error.errorId,
                    message: error.message
                });
                break;
            case 'email':
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: 'admin@example.com',
                    subject: 'Unresolved Error Notification',
                    text: `Error ID: ${error.errorId}\nMessage: ${error.message}\nStack: ${error.stack}`
                };

                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        logger.error('Email notification failed', {
                            errorId: error.errorId,
                            message: error.message,
                            emailError: error.message
                        });
                    } else {
                        logger.info('Email sent', {
                            errorId: error.errorId,
                            message: error.message,
                            response: info.response
                        });
                    }
                });
                break;
            case 'slack':
                slack.alert(`Unresolved Error Notification\nError ID: ${error.errorId}\nMessage: ${error.message}\nStack: ${error.stack}`);
                break;
            // Add more notification methods as needed
        }
    }
}

module.exports = new ErrorTrackingService();
