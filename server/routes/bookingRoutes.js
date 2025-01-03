import express from 'express';
import * as bookingController from '../controllers/bookingController.js';
import { validateBookingData } from '../../src/utils/bookingValidationUtils.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply validation middleware to all booking routes
router.use((req, res, next) => {
    console.log(`Booking request: ${req.method} ${req.originalUrl}`);
    next();
});

router.post('/', 
    protect,
    (req, res, next) => {
        const validation = validateBookingData(req.body);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                errors: validation.errors
            });
        }
        next();
    }, 
    bookingController.createBooking
);

router.get('/slots', protect, bookingController.getAvailableSlots);
router.get('/real-time-availability', protect, bookingController.getRealTimeAvailability);
router.post('/validate', protect, bookingController.validateDateTime);
router.post('/reserve', protect, bookingController.reserveSlot);
router.get('/weather', protect, bookingController.getWeatherConditions);
router.get('/recommendations', protect, bookingController.getRecommendedSlots);

export default router;
