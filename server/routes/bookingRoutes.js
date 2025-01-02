const express = require('express');
const bookingController = require('../controllers/bookingController');
const { validateBookingData } = require('../../src/utils/bookingValidationUtils');

const router = express.Router();

// Apply validation middleware to all booking routes
router.use((req, res, next) => {
    console.log(`Booking request: ${req.method} ${req.originalUrl}`);
    next();
});

router.post('/', (req, res, next) => {
    const validation = validateBookingData(req.body);
    if (!validation.isValid) {
        return res.status(400).json({
            success: false,
            errors: validation.errors
        });
    }
    next();
}, bookingController.createBooking);
router.get('/slots', bookingController.getAvailableSlots);
router.get('/real-time-availability', bookingController.getRealTimeAvailability);
router.post('/validate', bookingController.validateDateTime);
router.post('/reserve', bookingController.reserveSlot);
router.get('/weather', bookingController.getWeatherConditions);
router.get('/recommendations', bookingController.getRecommendedSlots);

module.exports = router;
