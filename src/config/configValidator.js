import axios from 'axios';

class FrontendConfigValidator {
    constructor() {
        this.config = {
            development: {
                apiBaseUrl: 'http://localhost:5000/api',
                socketUrl: 'http://localhost:5000',
                logLevel: 'debug',
                cacheTimeout: 5 * 60 * 1000, // 5 minutes
                features: {
                    booking: {
                        enabled: true,
                        allowCancellation: true,
                        maxBookingsPerDay: 5,
                        advanceBookingDays: 30
                    },
                    payment: {
                        enabled: true,
                        methods: ['square', 'stripe']
                    },
                    admin: {
                        dashboard: true,
                        userManagement: true,
                        analyticsAccess: true
                    }
                }
            },
            production: {
                apiBaseUrl: 'https://precisiondetailing.com/api',
                socketUrl: 'https://precisiondetailing.com',
                logLevel: 'error',
                cacheTimeout: 15 * 60 * 1000, // 15 minutes
                features: {
                    booking: {
                        enabled: true,
                        allowCancellation: false,
                        maxBookingsPerDay: 3,
                        advanceBookingDays: 14
                    },
                    payment: {
                        enabled: true,
                        methods: ['square']
                    },
                    admin: {
                        dashboard: true,
                        userManagement: false,
                        analyticsAccess: true
                    }
                }
            }
        };

        this.currentEnv = this.detectEnvironment();
        this.cache = {
            remoteConfig: null,
            timestamp: 0
        };
    }

    detectEnvironment() {
        const env = process.env.REACT_APP_ENV || 'development';
        return ['development', 'production'].includes(env) ? env : 'development';
    }

    get(key, defaultValue = null) {
        const envConfig = this.config[this.currentEnv];
        const value = this.traverseObject(envConfig, key);
        return value !== undefined ? value : defaultValue;
    }

    traverseObject(obj, path) {
        return path.split('.').reduce((acc, part) => 
            acc && acc[part] !== undefined ? acc[part] : undefined, obj);
    }

    getFeatureFlag(feature, subFeature = null) {
        const path = subFeature 
            ? `features.${feature}.${subFeature}` 
            : `features.${feature}`;
        return this.get(path, false);
    }

    validateConfig() {
        const requiredKeys = [
            'apiBaseUrl', 
            'socketUrl', 
            'logLevel'
        ];

        const missingKeys = requiredKeys.filter(key => 
            this.get(key) === null
        );

        if (missingKeys.length > 0) {
            console.error('Missing configuration keys:', missingKeys);
            throw new Error(`Missing configuration keys: ${missingKeys.join(', ')}`);
        }
    }

    async fetchRemoteConfig() {
        const now = Date.now();
        const cacheTimeout = this.get('cacheTimeout', 5 * 60 * 1000);

        // Check cache first
        if (this.cache.remoteConfig && 
            (now - this.cache.timestamp) < cacheTimeout) {
            return this.cache.remoteConfig;
        }

        try {
            const response = await axios.get(`${this.get('apiBaseUrl')}/config`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });

            // Merge remote config with local config
            const mergedConfig = {
                ...this.config[this.currentEnv],
                ...response.data
            };

            // Update cache
            this.cache = {
                remoteConfig: mergedConfig,
                timestamp: now
            };

            return mergedConfig;
        } catch (error) {
            console.warn('Failed to fetch remote configuration', error);
            return this.config[this.currentEnv];
        }
    }

    createLogger() {
        const logLevel = this.get('logLevel');
        return {
            debug: logLevel === 'debug' ? console.log : () => {},
            info: ['debug', 'info'].includes(logLevel) ? console.info : () => {},
            warn: ['debug', 'info', 'warn'].includes(logLevel) ? console.warn : () => {},
            error: console.error
        };
    }

    clearCache() {
        this.cache = {
            remoteConfig: null,
            timestamp: 0
        };
    }
}

export default new FrontendConfigValidator();
