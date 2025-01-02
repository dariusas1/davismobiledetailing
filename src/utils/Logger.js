class Logger {
    static levels = {
        ERROR: 'ERROR',
        WARN: 'WARN',
        INFO: 'INFO',
        DEBUG: 'DEBUG'
    };

    static currentLevel = this.levels.INFO;

    static setLogLevel(level) {
        if (Object.values(this.levels).includes(level)) {
            this.currentLevel = level;
        } else {
            throw new Error('Invalid log level');
        }
    }

    static log(level, message, metadata = {}) {
        // Check if the current log level allows this message
        const logLevels = Object.values(this.levels);
        const currentLevelIndex = logLevels.indexOf(this.currentLevel);
        const messageLevelIndex = logLevels.indexOf(level);

        if (messageLevelIndex > currentLevelIndex) {
            return;
        }

        const logEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            metadata
        };

        // Console logging
        switch(level) {
            case this.levels.ERROR:
                console.error(JSON.stringify(logEntry));
                break;
            case this.levels.WARN:
                console.warn(JSON.stringify(logEntry));
                break;
            case this.levels.INFO:
                console.info(JSON.stringify(logEntry));
                break;
            case this.levels.DEBUG:
                console.debug(JSON.stringify(logEntry));
                break;
        }

        // In a real-world scenario, you would also send this to a backend logging service
        this.sendToLoggingService(logEntry);
    }

    static error(message, metadata = {}) {
        this.log(this.levels.ERROR, message, metadata);
    }

    static warn(message, metadata = {}) {
        this.log(this.levels.WARN, message, metadata);
    }

    static info(message, metadata = {}) {
        this.log(this.levels.INFO, message, metadata);
    }

    static debug(message, metadata = {}) {
        this.log(this.levels.DEBUG, message, metadata);
    }

    static sendToLoggingService(logEntry) {
        // Placeholder for sending logs to a backend service
        // In a real application, this would make an API call to your logging backend
        try {
            // Example fetch call (commented out as it's a placeholder)
            // fetch('/api/logs', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(logEntry)
            // });
        } catch (error) {
            console.error('Failed to send log to service', error);
        }
    }
}

export default Logger;
