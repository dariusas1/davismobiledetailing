import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    createReminder,
    getUserReminders,
    updateReminder,
    completeService,
    deleteReminder
} from '../controllers/maintenanceReminderController.js';

const router = express.Router();

// Protected routes
router.use(protect);

// User routes
router.post('/', createReminder);
router.get('/my-reminders', getUserReminders);
router.put('/:id', updateReminder);
router.post('/:id/complete', completeService);
router.delete('/:id', deleteReminder);

export default router; 