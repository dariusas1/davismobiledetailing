import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    createGiftCard,
    getGiftCard,
    redeemGiftCard,
    getAllGiftCards,
    cancelGiftCard,
    getGiftCardStats
} from '../controllers/giftCardController.js';

const router = express.Router();

// Public routes
router.get('/code/:code', getGiftCard);

// Protected routes
router.use(protect);
router.post('/', createGiftCard);
router.post('/redeem/:code', redeemGiftCard);

// Admin routes
router.get('/admin/all', getAllGiftCards);
router.post('/admin/cancel/:id', cancelGiftCard);
router.get('/admin/stats', getGiftCardStats);

export default router; 