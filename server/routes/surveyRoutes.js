import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
    createSurvey,
    submitSurvey,
    getSurvey,
    getUserSurveys,
    getAllSurveys,
    addAdminResponse,
    getSurveyStats
} from '../controllers/surveyController.js';

const router = express.Router();

// Protected routes
router.use(protect);

// User routes
router.get('/my-surveys', getUserSurveys);
router.get('/:surveyId', getSurvey);
router.post('/:surveyId/submit', submitSurvey);

// Admin routes
router.post('/booking/:bookingId', authorize('admin'), createSurvey);
router.get('/admin/all', authorize('admin'), getAllSurveys);
router.post('/:surveyId/respond', authorize('admin'), addAdminResponse);
router.get('/admin/stats', authorize('admin'), getSurveyStats);

export default router; 