/* eslint-disable default-case */
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { logger } = require('../utils/logger');

// Fallback weather data for Santa Cruz
const SANTA_CRUZ_FALLBACK_WEATHER = {
    temperature: 65,
    description: 'Partly Cloudy',
    icon: '02d',
    location: 'Santa Cruz',
    source: 'Fallback Data'
};

// Predefined weather data for different seasons
const SEASONAL_FALLBACK_WEATHER = {
    winter: {
        temperature: 55,
        description: 'Cool and Cloudy',
        icon: '04d'
    },
    spring: {
        temperature: 65,
        description: 'Mild and Partly Cloudy',
        icon: '02d'
    },
    summer: {
        temperature: 75,
        description: 'Warm and Sunny',
        icon: '01d'
    },
    fall: {
        temperature: 60,
        description: 'Crisp and Clear',
        icon: '01d'
    }
};

// Rate limiting middleware for weather API
const rateLimit = require('express-rate-limit');
const weatherRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many weather requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false
});

// Get weather for Santa Cruz
router.get('/', weatherRateLimiter, async (req, res) => {
    try {
        const location = req.query.location || 'Santa Cruz';
        
        // Determine current season
        const currentMonth = new Date().getMonth();
        const season = currentMonth >= 2 && currentMonth <= 4 ? 'spring' :
                       currentMonth >= 5 && currentMonth <= 7 ? 'summer' :
                       currentMonth >= 8 && currentMonth <= 10 ? 'fall' : 'winter';

        // Combine seasonal fallback with base fallback
        const seasonalFallbackWeather = {
            ...SANTA_CRUZ_FALLBACK_WEATHER,
            ...SEASONAL_FALLBACK_WEATHER[season],
            source: `Seasonal Fallback (${season})`
        };
        
        // Check if OpenWeather API key is available
        const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
        if (!OPENWEATHER_API_KEY) {
            logger.warn('OpenWeather API key not found, using seasonal fallback data');
            return res.json(seasonalFallbackWeather);
        }

        // Add API key validation
        if (!/^[a-f0-9]{32}$/.test(OPENWEATHER_API_KEY)) {
            logger.error('Invalid OpenWeather API key format');
            return res.status(500).json({
                message: 'Invalid API key configuration',
                fallbackData: seasonalFallbackWeather
            });
        }

        try {
            const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
                params: {
                    q: location,
                    appid: OPENWEATHER_API_KEY,
                    units: 'imperial' // Use Fahrenheit
                },
                timeout: 5000 // 5 seconds timeout
            });

            const weatherData = {
                temperature: Math.round(response.data.main.temp),
                description: response.data.weather[0].description,
                icon: response.data.weather[0].icon,
                location: response.data.name,
                source: 'OpenWeatherMap API'
            };

            logger.info('Weather data retrieved successfully', { 
                location: weatherData.location, 
                temperature: weatherData.temperature 
            });

            res.json(weatherData);
        } catch (apiError) {
            // Detailed logging for API errors
            if (apiError.response) {
                logger.error('Weather API error', { 
                    status: apiError.response.status,
                    data: apiError.response.data,
                    headers: apiError.response.headers
                });

                // Handle specific API error codes
                switch (apiError.response.status) {
                    case 401:
                        logger.warn('API key activation pending or invalid', {
                            apiKey: OPENWEATHER_API_KEY ? 'Present' : 'Missing'
                        });
                        break;
                    case 429:
                        logger.warn('Rate limit exceeded');
                        break;
                }
            } else if (apiError.request) {
                logger.error('No response received from Weather API', {
                    request: apiError.request
                });
            } else {
                logger.error('Error setting up Weather API request', {
                    message: apiError.message
                });
            }

            // Return seasonal fallback data with error context
            const fallbackWeather = {
                ...seasonalFallbackWeather,
                apiErrorContext: {
                    status: apiError.response?.status,
                    message: apiError.response?.data?.message || 'Unknown API error'
                }
            };

            res.json(fallbackWeather);
        }
    } catch (error) {
        logger.error('Unexpected error in weather route', {
            error: error.message,
            stack: error.stack
        });

        res.status(500).json({
            message: 'Internal server error',
            fallbackData: SANTA_CRUZ_FALLBACK_WEATHER
        });
    }
});

module.exports = router;
