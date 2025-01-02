import Logger from './Logger';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Custom error classes
export class ApiError extends Error {
    constructor(message, status, code) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
    }
}

export class ValidationError extends ApiError {
    constructor(message) {
        super(message, 400, 'VALIDATION_ERROR');
    }
}

export class AuthorizationError extends ApiError {
    constructor(message) {
        super(message, 403, 'AUTHORIZATION_ERROR');
    }
}

class ErrorHandler {
    // Global error handling strategy
    static handleError(error, context = {}) {
        // Log the error
        Logger.error('Unhandled Error', {
            message: error.message,
            stack: error.stack,
            context
        });

        // Categorize error types
        const errorType = this.categorizeError(error);

        // Perform specific recovery actions
        switch (errorType) {
            case 'NETWORK':
                this.handleNetworkError(error);
                break;
            case 'AUTH':
                this.handleAuthError(error);
                break;
            case 'VALIDATION':
                this.handleValidationError(error);
                break;
            default:
                this.handleGenericError(error);
        }
    }

    // Categorize error types
    static categorizeError(error) {
        if (error.code === 'auth/network-request-failed') return 'NETWORK';
        if (error.code && error.code.startsWith('auth/')) return 'AUTH';
        if (error.name === 'ValidationError') return 'VALIDATION';
        return 'GENERIC';
    }

    // Network error handling
    static handleNetworkError(error) {
        // Retry mechanism
        const maxRetries = 3;
        let retryCount = 0;

        const retryOperation = async (operation) => {
            try {
                return await operation();
            } catch (err) {
                if (retryCount < maxRetries) {
                    retryCount++;
                    await this.waitWithBackoff(retryCount);
                    return retryOperation(operation);
                }
                throw err;
            }
        };

        // Notify user about network issues
        this.showUserNotification(
            'Network Error',
            'Unable to connect. Retrying...',
            'warning'
        );
    }

    // Authentication error handling
    static handleAuthError(error) {
        switch (error.code) {
            case 'auth/invalid-credential':
                this.showUserNotification(
                    'Login Failed',
                    'Invalid email or password. Please try again.',
                    'error'
                );
                break;
            case 'auth/too-many-requests':
                this.showUserNotification(
                    'Account Locked',
                    'Too many failed attempts. Please reset your password or try again later.',
                    'error'
                );
                break;
            default:
                this.showUserNotification(
                    'Authentication Error',
                    'An unexpected error occurred. Please try again.',
                    'error'
                );
        }
    }

    // Validation error handling
    static handleValidationError(error) {
        const validationErrors = error.details || {};
        
        // Highlight specific form fields with errors
        Object.keys(validationErrors).forEach(field => {
            const fieldElement = document.querySelector(`[name="${field}"]`);
            if (fieldElement) {
                fieldElement.classList.add('error-highlight');
            }
        });

        this.showUserNotification(
            'Validation Error',
            'Please check the highlighted fields.',
            'warning'
        );
    }

    // Generic error handling
    static handleGenericError(error) {
        this.showUserNotification(
            'Unexpected Error',
            'Something went wrong. Our team has been notified.',
            'error'
        );
    }

    // Exponential backoff for retries
    static async waitWithBackoff(retryCount) {
        const baseDelay = 1000; // 1 second
        const delay = baseDelay * Math.pow(2, retryCount);
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    // User notification method using react-toastify
    static showUserNotification(title, message, type = 'info') {
        switch(type) {
            case 'error':
                toast.error(message, { 
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
                break;
            case 'warning':
                toast.warn(message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
                break;
            case 'success':
                toast.success(message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
                break;
            default:
                toast.info(message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
        }

        // Optional: Send error to monitoring service
        this.reportToMonitoringService({
            title,
            message,
            type
        });
    }

    // Report to external monitoring service
    static reportToMonitoringService(errorData) {
        // Placeholder for external error reporting
        // In a real app, integrate with services like Sentry, LogRocket, etc.
        Logger.info('Error reported to monitoring service', errorData);
    }

    // Create a global error handler for uncaught exceptions
    static initGlobalErrorHandling() {
        // Browser global error handler
        window.addEventListener('error', (event) => {
            this.handleError(event.error, {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });

        // Promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason);
        });
    }
}

// Error handling utility
export const handleApiError = (error, customMessage = 'An error occurred') => {
    // Log error to console
    console.error('API Error:', error);

    // Extract error details
    const errorResponse = error.response?.data || {};
    const errorMessage = errorResponse.message || customMessage;
    const errorStatus = error.response?.status;

    // Notify user based on error type
    switch (errorStatus) {
        case 400:
            toast.error(`Validation Error: ${errorMessage}`);
            break;
        case 401:
            toast.error('Authentication failed. Please log in again.');
            // Optionally trigger logout or redirect
            break;
        case 403:
            toast.error('You are not authorized to perform this action.');
            break;
        case 404:
            toast.error('Requested resource not found.');
            break;
        case 500:
            toast.error('Server error. Please try again later.');
            break;
        default:
            toast.error(errorMessage);
    }

    // Throw error for further handling if needed
    throw new ApiError(errorMessage, errorStatus, errorResponse.code);
};

// Global error boundary handler
export const globalErrorHandler = (error, info) => {
    console.error('Unhandled Error:', error, info);
    
    toast.error('An unexpected error occurred. Please try again.');
    
    // Optional: Send error to logging service
    // logErrorToService(error, info);
};

// Async error wrapper
export const withErrorHandling = (fn) => async (...args) => {
    try {
        return await fn(...args);
    } catch (error) {
        handleApiError(error);
    }
};

// Optional: Error logging service
const logErrorToService = async (error, info) => {
    try {
        // Implement error logging to backend service
        await fetch('/api/log-error', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                error: error.toString(),
                info: info,
                timestamp: new Date().toISOString()
            })
        });
    } catch (logError) {
        console.error('Failed to log error:', logError);
    }
};

export default ErrorHandler;
