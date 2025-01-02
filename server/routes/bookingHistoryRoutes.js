/* eslint-disable no-unused-vars */
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/authMiddleware');

// Get User's Booking History
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch bookings with detailed information
        const bookings = await Booking.find({ user: userId })
            .sort({ bookingDate: -1 })
            .populate('service')
            .populate('vehicle');

        // Calculate summary statistics
        const bookingSummary = {
            totalBookings: bookings.length,
            totalSpent: bookings.reduce((total, booking) => total + booking.totalPrice, 0),
            mostFrequentService: getMostFrequentService(bookings),
            recentBookings: bookings.slice(0, 5)
        };

        res.json({
            bookings,
            summary: bookingSummary
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error retrieving booking history', 
            error: error.message 
        });
    }
});

// Get Specific Booking Details
router.get('/:bookingId', authenticateToken, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId)
            .populate('service')
            .populate('vehicle')
            .populate('user', 'profile');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Verify booking belongs to current user
        if (booking.user._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error retrieving booking details', 
            error: error.message 
        });
    }
});

// Cancel Upcoming Booking
router.patch('/:bookingId/cancel', authenticateToken, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Verify booking belongs to current user
        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized cancellation' });
        }

        // Check if booking is cancellable (at least 24 hours before)
        const bookingDate = new Date(booking.bookingDate);
        const now = new Date();
        const hoursDifference = (bookingDate - now) / (1000 * 60 * 60);

        if (hoursDifference < 24) {
            return res.status(400).json({ 
                message: 'Booking cannot be cancelled less than 24 hours before service' 
            });
        }

        booking.status = 'Cancelled';
        await booking.save();

        res.json({ 
            message: 'Booking successfully cancelled', 
            booking 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error cancelling booking', 
            error: error.message 
        });
    }
});

// Helper function to get most frequent service
function getMostFrequentService(bookings) {
    const serviceCounts = bookings.reduce((counts, booking) => {
        const serviceName = booking.service.name;
        counts[serviceName] = (counts[serviceName] || 0) + 1;
        return counts;
    }, {});

    return Object.entries(serviceCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'No frequent service';
}

module.exports = router;
