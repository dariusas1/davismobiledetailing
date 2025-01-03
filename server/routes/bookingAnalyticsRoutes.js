import express from 'express';
import { protect } from '../middleware/auth.js';
import logger from '../config/logger.js';
import * as bookingAnalyticsService from '../services/bookingAnalyticsService.js';

const router = express.Router();

router.get('/stats', 
    protect,
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
    protect,
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
    protect,
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
    protect,
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

export default router;
