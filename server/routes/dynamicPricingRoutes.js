import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    initializePricing,
    getCurrentPrice,
    updatePricingFactors,
    getPriceHistory,
    updatePricingRules
} from '../controllers/dynamicPricingController.js';

const router = express.Router();

// Public routes
router.get('/service/:serviceId/price', getCurrentPrice);

// Protected routes
router.use(protect);

// Admin routes
router.post('/initialize', initializePricing);
router.put('/service/:serviceId/factors', updatePricingFactors);
router.get('/service/:serviceId/history', getPriceHistory);
router.put('/service/:serviceId/rules', updatePricingRules);

export default router; 