import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    submitFeedback,
    getUserFeedback,
    addResponse,
    getAllFeedback,
    updateFeedbackStatus,
    getFeedbackStats
} from '../controllers/feedbackController.js';

const router = express.Router();

// Protected routes
router.use(protect);

// User routes
router.post('/', submitFeedback);
router.get('/my-feedback', getUserFeedback);
router.post('/:id/respond', addResponse);

// Admin routes
router.get('/admin/all', getAllFeedback);
router.put('/admin/:id/status', updateFeedbackStatus);
router.get('/admin/stats', getFeedbackStats);

export default router; 