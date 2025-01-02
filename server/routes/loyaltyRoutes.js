const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken } = require('../middleware/authMiddleware');

// Redeem Loyalty Points
router.post('/redeem', authenticateToken, async (req, res) => {
    try {
        const { pointsToRedeem } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        try {
            const redemptionResult = user.redeemLoyaltyPoints(pointsToRedeem);
            await user.save();

            res.json({
                message: 'Points redeemed successfully',
                discountAmount: redemptionResult.discountAmount,
                remainingPoints: redemptionResult.remainingPoints
            });
        } catch (redemptionError) {
            return res.status(400).json({ 
                message: redemptionError.message 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            message: 'Error redeeming loyalty points', 
            error: error.message 
        });
    }
});

// Get Loyalty Program Details
router.get('/program-details', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const loyaltyTiers = [
            { 
                name: 'Bronze', 
                minPoints: 0, 
                maxPoints: 99, 
                benefits: [],
                description: 'Starting tier for new members'
            },
            { 
                name: 'Silver', 
                minPoints: 100, 
                maxPoints: 299, 
                benefits: [
                    '5% off next booking',
                    'Priority scheduling'
                ],
                description: 'Unlock basic perks and discounts'
            },
            { 
                name: 'Gold', 
                minPoints: 300, 
                maxPoints: 599, 
                benefits: [
                    '10% off next booking',
                    'Free add-on service',
                    'Dedicated support'
                ],
                description: 'Enhanced benefits and personalized service'
            },
            { 
                name: 'Platinum', 
                minPoints: 600, 
                benefits: [
                    '15% off next booking',
                    'Free premium add-on',
                    'Complimentary annual detail',
                    'Personal detailing concierge'
                ],
                description: 'Top-tier exclusive benefits'
            }
        ];

        res.json({
            currentTier: user.loyaltyTier,
            currentPoints: user.loyaltyPoints,
            loyaltyTiers,
            redemptionRates: {
                'Bronze': { rate: 100, discount: 10 },
                'Silver': { rate: 80, discount: 10 },
                'Gold': { rate: 60, discount: 10 },
                'Platinum': { rate: 50, discount: 10 }
            }
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error retrieving loyalty program details', 
            error: error.message 
        });
    }
});

module.exports = router;
