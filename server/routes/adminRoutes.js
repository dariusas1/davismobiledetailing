import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    getDashboardStats,
    getAllServices,
    updateService,
    getBookings,
    getCustomers,
    getContentStats,
    getLoyaltyStats,
    getPromotions,
    updatePromotion
} from '../controllers/adminController.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Dashboard routes
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/content', getContentStats);
router.get('/dashboard/loyalty', getLoyaltyStats);

// Service management
router.get('/services', getAllServices);
router.put('/services/:id', updateService);

// Booking management
router.get('/bookings', getBookings);

// Customer management
router.get('/customers', getCustomers);

// Promotion management
router.get('/promotions', getPromotions);
router.put('/promotions/:id', updatePromotion);

export default router; 