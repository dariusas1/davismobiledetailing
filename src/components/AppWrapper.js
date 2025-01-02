import React from 'react';
import ErrorBoundary from '../utils/ErrorBoundary';
import Logger from '../utils/Logger';
import App from '../App';

const AppWrapper = () => {
    // Log app initialization
    React.useEffect(() => {
        Logger.info('Application initialized');
        
        // Optional: Log browser and device information
        Logger.debug('Browser Info', {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language
        });
    }, []);

    return (
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    );
};

export default AppWrapper;
