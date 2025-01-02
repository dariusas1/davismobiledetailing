import axios from 'axios';
import { logger } from './loggerService';

class ErrorHandlingService {
    // Centralized error handler for API calls
    async handleApiError(error) {
        // Check if error is from axios
        if (axios.isAxiosError(error)) {
            const { response, request, message } = error;

            if (response) {
                // The request was made and the server responded with a status code
                const { status, data } = response;
                
                switch (status) {
                    case 400:
                        this.handleBadRequestError(data);
                        break;
                    case 401:
                        this.handleUnauthorizedError();
                        break;
                    case 403:
                        this.handleForbiddenError();
                        break;
                    case 404:
                        this.handleNotFoundError(data);
                        break;
                    case 500:
                        this.handleServerError(data);
                        break;
                    default:
                        this.handleGenericError(message);
                }
            } else if (request) {
                // The request was made but no response was received
                this.handleNetworkError();
            } else {
                // Something happened in setting up the request
                this.handleGenericError(message);
            }
        } else {
            // Handle non-axios errors
            this.handleGenericError(error.message);
        }

        // Log the error
        logger.error('API Error', {
            message: error.message,
            stack: error.stack
        });
    }

    // Specific error type handlers
    handleBadRequestError(data) {
        const errorMessage = data.message || 'Invalid request parameters';
        this.showToast(errorMessage, 'error');
    }

    handleUnauthorizedError() {
        // Redirect to login or refresh token
        this.showToast('Please log in again', 'warning');
        // Optional: Call logout method
        // authService.logout();
    }

    handleForbiddenError() {
        this.showToast('You do not have permission', 'error');
    }

    handleNotFoundError(data) {
        const errorMessage = data.message || 'Resource not found';
        this.showToast(errorMessage, 'warning');
    }

    handleServerError(data) {
        const errorMessage = data.message || 'Internal server error';
        this.showToast(errorMessage, 'error');
    }

    handleNetworkError() {
        this.showToast('Network error. Please check your connection', 'error');
    }

    handleGenericError(message) {
        this.showToast(message || 'An unexpected error occurred', 'error');
    }

    // Toast notification method (can be replaced with your preferred notification system)
    showToast(message, type = 'error') {
        // Example using a hypothetical toast library
        // toast[type](message);
        console[type === 'error' ? 'error' : 'warn'](message);
    }

    // Wrap async functions with error handling
    wrapAsync(fn) {
        return async (...args) => {
            try {
                return await fn(...args);
            } catch (error) {
                this.handleApiError(error);
                throw error; // Re-throw to allow further handling if needed
            }
        };
    }
}

export default new ErrorHandlingService();
