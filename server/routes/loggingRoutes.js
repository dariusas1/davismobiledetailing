import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
    getLogFiles,
    getLogContent,
    getLogStats,
    searchLogs
} from '../controllers/loggingController.js';

const router = express.Router();

// Protect all routes and restrict to admin only
router.use(protect);
router.use(authorize(['admin']));

// Log routes
router.get('/files', getLogFiles);
router.get('/content', getLogContent);
router.get('/stats', getLogStats);
router.get('/search', searchLogs);

export default router; 