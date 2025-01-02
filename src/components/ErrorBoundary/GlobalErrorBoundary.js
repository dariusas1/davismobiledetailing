import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { logger } from '../../services/loggerService';

// Fallback component for rendering when an error occurs
const ErrorFallback = ({ error, resetErrorBoundary }) => {
    // Log the error
    React.useEffect(() => {
        logger.error('Unhandled Component Error', {
            message: error.message,
            stack: error.stack
        });
    }, [error]);

    return (
        <div role="alert" className="error-fallback">
            <h2>Oops! Something went wrong</h2>
            <pre style={{ color: 'red' }}>{error.message}</pre>
            <button onClick={resetErrorBoundary}>
                Try again
            </button>
        </div>
    );
};

// Global Error Boundary Wrapper
const GlobalErrorBoundary = ({ children }) => {
    const handleError = (error, errorInfo) => {
        // Centralized error logging
        logger.error('Unhandled Error in Component', {
            error: error.message,
            errorInfo
        });

        // Optional: Send error to backend tracking service
        // errorTrackingService.logError(error);
    };

    return (
        <ErrorBoundary 
            FallbackComponent={ErrorFallback}
            onError={handleError}
            onReset={() => {
                // Optional: Perform cleanup or reset state
            }}
        >
            {children}
        </ErrorBoundary>
    );
};

export default GlobalErrorBoundary;
