const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');
const moment = require('moment');

// Comprehensive User Analytics
router.get('/dashboard', async (req, res) => {
    try {
        const userId = req.user.id;

        // Aggregate booking analytics
        const bookingAnalytics = await Booking.aggregate([
            { $match: { user: mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    totalBookings: { $sum: 1 },
                    totalSpent: { $sum: '$totalPrice' },
                    serviceBreakdown: {
                        $push: {
                            service: '$service',
                            price: '$totalPrice'
                        }
                    },
                    bookingsByMonth: {
                        $push: {
                            month: { $month: '$bookingDate' },
                            count: 1
                        }
                    }
                }
            }
        ]);

        // Vehicle type analytics
        const vehicleTypeAnalytics = await Booking.aggregate([
            { $match: { user: mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: '$vehicle.type',
                    count: { $sum: 1 },
                    totalSpent: { $sum: '$totalPrice' }
                }
            }
        ]);

        // Loyalty and rewards calculation
        const user = await User.findById(userId);
        const loyaltyTiers = [
            { name: 'Bronze', minPoints: 0, maxPoints: 99 },
            { name: 'Silver', minPoints: 100, maxPoints: 299 },
            { name: 'Gold', minPoints: 300, maxPoints: 599 },
            { name: 'Platinum', minPoints: 600 }
        ];

        const currentTier = loyaltyTiers.find(tier => 
            user.loyaltyPoints >= tier.minPoints && 
            (tier.maxPoints === undefined || user.loyaltyPoints <= tier.maxPoints)
        );

        // Predictive service recommendations
        const servicePreferences = await calculateServicePreferences(userId);

        res.json({
            userProfile: {
                name: user.fullName,
                email: user.email,
                loyaltyPoints: user.loyaltyPoints,
                loyaltyTier: currentTier.name
            },
            bookingAnalytics: bookingAnalytics[0] || {
                totalBookings: 0,
                totalSpent: 0
            },
            vehicleTypeAnalytics,
            servicePreferences,
            loyaltyProgram: {
                currentTier: currentTier.name,
                pointsToNextTier: calculatePointsToNextTier(user.loyaltyPoints, loyaltyTiers)
            }
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error retrieving user analytics', 
            error: error.message 
        });
    }
});

// Calculate service preferences
async function calculateServicePreferences(userId) {
    const servicePreferences = await Booking.aggregate([
        { $match: { user: mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: '$service.name',
                frequency: { $sum: 1 },
                totalSpent: { $sum: '$totalPrice' }
            }
        },
        { $sort: { frequency: -1 } },
        { $limit: 3 }
    ]);

    return servicePreferences.map(pref => ({
        serviceName: pref._id,
        frequency: pref.frequency,
        totalSpent: pref.totalSpent
    }));
}

// Calculate points to next loyalty tier
function calculatePointsToNextTier(currentPoints, loyaltyTiers) {
    const currentTier = loyaltyTiers.find(tier => 
        currentPoints >= tier.minPoints && 
        (tier.maxPoints === undefined || currentPoints <= tier.maxPoints)
    );

    const currentTierIndex = loyaltyTiers.indexOf(currentTier);
    const nextTier = loyaltyTiers[currentTierIndex + 1];

    return nextTier 
        ? nextTier.minPoints - currentPoints 
        : 0;
}

module.exports = router;
