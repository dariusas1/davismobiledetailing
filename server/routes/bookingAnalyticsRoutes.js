const express = require('express');
const router = express.Router();
const bookingAnalyticsService = require('../services/bookingAnalyticsService');
const authMiddleware = require('../middleware/authMiddleware');
const logger = require('../utils/logger').logger;

router.get('/stats', 
    authMiddleware.authenticateUser,
    async (req, res, next) => {
        try {
            const stats = await bookingAnalyticsService.getBookingStats();
            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            logger.error('Error retrieving booking stats', { 
                error: error.message,
                userId: req.user?.id 
            });
            next(error);
        }
    }
);

router.get('/trends', 
    authMiddleware.authenticateUser,
    async (req, res, next) => {
        try {
            const trends = await bookingAnalyticsService.getBookingTrends();
            res.status(200).json({
                success: true,
                data: trends
            });
        } catch (error) {
            logger.error('Error retrieving booking trends', { 
                error: error.message,
                userId: req.user?.id 
            });
            next(error);
        }
    }
);

router.get('/popular-services', 
    authMiddleware.authenticateUser,
    async (req, res, next) => {
        try {
            const services = await bookingAnalyticsService.getPopularServices();
            res.status(200).json({
                success: true,
                data: services
            });
        } catch (error) {
            logger.error('Error retrieving popular services', { 
                error: error.message,
                userId: req.user?.id 
            });
            next(error);
        }
    }
);

router.get('/capacity', 
    authMiddleware.authenticateUser,
    async (req, res, next) => {
        try {
            const capacity = await bookingAnalyticsService.getPredictiveBookingCapacity();
            res.status(200).json({
                success: true,
                data: capacity
            });
        } catch (error) {
            logger.error('Error retrieving booking capacity', { 
                error: error.message,
                userId: req.user?.id 
            });
            next(error);
        }
    }
);

module.exports = router;
