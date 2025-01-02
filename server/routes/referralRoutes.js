import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    createReferralCode,
    applyReferralCode,
    completeReferral,
    getUserReferrals,
    getAllReferrals,
    getReferralStats
} from '../controllers/referralController.js';

const router = express.Router();

// Protected routes
router.use(protect);

// User routes
router.post('/create', createReferralCode);
router.post('/apply', applyReferralCode);
router.get('/my-referrals', getUserReferrals);

// Admin routes
router.post('/complete', completeReferral);
router.get('/admin/all', getAllReferrals);
router.get('/admin/stats', getReferralStats);

export default router; 