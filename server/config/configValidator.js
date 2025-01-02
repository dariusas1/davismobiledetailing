import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import winston from 'winston';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a simple logger if not already imported
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'config-errors.log' })
    ]
});

class ConfigValidator {
    constructor() {
        try {
            this.loadEnvFile();
            this.validateConfig();
        } catch (error) {
            console.error('Configuration Initialization Error:', error);
            logger.error('Configuration Initialization Error', { 
                message: error.message, 
                stack: error.stack 
            });
            throw error;
        }
    }

    loadEnvFile() {
        const envPath = path.resolve(__dirname, '../../.env');
        
        console.log(`Attempting to load environment file from: ${envPath}`);
        
        if (!fs.existsSync(envPath)) {
            const errorMsg = `Environment file not found at ${envPath}`;
            console.error(errorMsg);
            throw new Error(errorMsg);
        }

        try {
            dotenv.config({ path: envPath });
            console.log('Environment file loaded successfully');
        } catch (error) {
            console.error('Error loading environment file:', error);
            throw error;
        }
    }

    validateConfig() {
        const requiredConfigs = {
            database: [
                'MONGODB_URI'
            ],
            server: [
                'PORT',
                'NODE_ENV'
            ],
            authentication: [
                'JWT_SECRET',
                'JWT_EXPIRATION'
            ],
            aws: [
                'AWS_ACCESS_KEY_ID',
                'AWS_SECRET_ACCESS_KEY',
                'AWS_S3_BUCKET_NAME',
                'AWS_S3_REGION'
            ],
            square: [
                'SQUARE_ACCESS_TOKEN',
                'SQUARE_ENVIRONMENT',
                'SQUARE_APPLICATION_ID',
                'SQUARE_LOCATION_ID'
            ],
            email: [
                'REACT_APP_RESEND_API_KEY'
            ]
        };

        const missingConfigs = [];
        const presentConfigs = {};

        Object.entries(requiredConfigs).forEach(([category, configs]) => {
            presentConfigs[category] = [];
            configs.forEach(config => {
                if (!process.env[config]) {
                    missingConfigs.push(`Missing ${category} config: ${config}`);
                } else {
                    // Mask sensitive information
                    presentConfigs[category].push(
                        config.includes('SECRET') || config.includes('TOKEN') 
                            ? config.replace(/./g, '*') 
                            : config
                    );
                }
            });
        });

        // Log present configurations (with sensitive info masked)
        console.log('Present Configurations:', JSON.stringify(presentConfigs, null, 2));

        if (missingConfigs.length > 0) {
            const errorMsg = `Configuration Validation Failed:\n${missingConfigs.join('\n')}`;
            console.error(errorMsg);
            logger.error('Configuration Validation Failed', { missingConfigs });
            throw new Error(errorMsg);
        }

        console.log('All required configurations are present');
    }

    get(key, defaultValue = null) {
        try {
            const value = process.env[key];
            
            // Log retrieval of sensitive configs with masking
            if (key.includes('SECRET') || key.includes('TOKEN')) {
                console.log(`Retrieving sensitive config: ${key.replace(/./g, '*')}`);
            }

            return value !== undefined ? value : defaultValue;
        } catch (error) {
            console.error(`Error retrieving config for key: ${key}`, error);
            logger.error('Config Retrieval Error', { 
                key, 
                error: error.message 
            });
            return defaultValue;
        }
    }

    getBoolean(key, defaultValue = false) {
        try {
            const value = this.get(key);
            return value ? ['true', '1', 'yes'].includes(value.toLowerCase()) : defaultValue;
        } catch (error) {
            console.error(`Error getting boolean for key: ${key}`, error);
            return defaultValue;
        }
    }

    getNumber(key, defaultValue = 0) {
        try {
            const value = this.get(key);
            const parsedValue = Number(value);
            return !isNaN(parsedValue) ? parsedValue : defaultValue;
        } catch (error) {
            console.error(`Error getting number for key: ${key}`, error);
            return defaultValue;
        }
    }

    getSensitiveConfig(key) {
        try {
            const value = this.get(key);
            return value ? value.replace(/./g, '*') : null;
        } catch (error) {
            console.error(`Error getting sensitive config for key: ${key}`, error);
            return null;
        }
    }

    getAllConfigs() {
        return {
            database: {
                uri: this.getSensitiveConfig('MONGODB_URI')
            },
            server: {
                port: this.getNumber('PORT', 5000),
                environment: this.get('NODE_ENV', 'development')
            },
            authentication: {
                jwtSecret: this.getSensitiveConfig('JWT_SECRET'),
                jwtExpiration: this.get('JWT_EXPIRATION', '1h')
            },
            aws: {
                accessKeyId: this.getSensitiveConfig('AWS_ACCESS_KEY_ID'),
                region: this.get('AWS_S3_REGION')
            },
            square: {
                environment: this.get('SQUARE_ENVIRONMENT', 'sandbox')
            }
        };
    }
}

export default new ConfigValidator();
