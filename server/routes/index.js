import express from 'express';
import adminRoutes from './adminRoutes.js';
import giftCardRoutes from './giftCardRoutes.js';
import referralRoutes from './referralRoutes.js';
import feedbackRoutes from './feedbackRoutes.js';
import dynamicPricingRoutes from './dynamicPricingRoutes.js';
import maintenanceReminderRoutes from './maintenanceReminderRoutes.js';

const router = express.Router();

// Mount routes
router.use('/admin', adminRoutes);
router.use('/gift-cards', giftCardRoutes);
router.use('/referrals', referralRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/pricing', dynamicPricingRoutes);
router.use('/maintenance', maintenanceReminderRoutes);

export default router; 