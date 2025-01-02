const express = require('express');
const router = express.Router();
const configValidator = require('../config/configValidator');
const logger = require('../config/logger');

// Configuration endpoint
router.get('/config', (req, res) => {
    try {
        const config = configValidator.getAllConfigs();
        
        // Add dynamic configuration based on request
        const dynamicConfig = {
            timestamp: Date.now(),
            environment: process.env.NODE_ENV,
            features: {
                booking: {
                    maxBookingsPerDay: process.env.MAX_BOOKINGS_PER_DAY || 5,
                    advanceBookingDays: process.env.ADVANCE_BOOKING_DAYS || 30
                },
                payment: {
                    availableMethods: ['square', 'stripe']
                }
            }
        };

        // Merge configurations
        const mergedConfig = {
            ...config,
            ...dynamicConfig
        };

        // Log configuration request
        logger.info('Configuration requested', {
            clientIp: req.ip,
            environment: process.env.NODE_ENV
        });

        res.json(mergedConfig);
    } catch (error) {
        logger.logError(error, { 
            action: 'Fetch Configuration',
            clientIp: req.ip 
        });
        
        res.status(500).json({ 
            error: 'Failed to retrieve configuration',
            message: error.message 
        });
    }
});

module.exports = router;
