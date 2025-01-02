import { Referral, User, LoyaltyPoints } from '../models/index.js';
import logger from '../config/logger.js';

// Create referral code for user
export const createReferralCode = async (req, res) => {
    try {
        let referral = await Referral.findOne({ referrer: req.user.id });

        if (referral) {
            return res.status(400).json({
                success: false,
                message: 'User already has a referral code'
            });
        }

        referral = new Referral({
            referrer: req.user.id,
            code: await Referral.generateCode()
        });

        await referral.save();

        res.status(201).json({
            success: true,
            data: referral
        });
    } catch (error) {
        logger.error('Error creating referral code:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating referral code'
        });
    }
};

// Apply referral code during signup
export const applyReferralCode = async (req, res) => {
    try {
        const { code } = req.body;
        const referral = await Referral.findOne({ code });

        if (!referral || !referral.isValid()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired referral code'
            });
        }

        await referral.addReferral(req.user.id);

        // Add signup bonus points to referred user
        const userLoyalty = await LoyaltyPoints.findOne({ user: req.user.id });
        if (userLoyalty) {
            await userLoyalty.addPoints(
                referral.rewards.signupBonus,
                'Referral signup bonus'
            );
        }

        res.status(200).json({
            success: true,
            data: referral
        });
    } catch (error) {
        logger.error('Error applying referral code:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error applying referral code'
        });
    }
};

// Complete referral after first booking
export const completeReferral = async (req, res) => {
    try {
        const { userId, bookingId } = req.body;
        const referral = await Referral.findOne({ 'referrals.user': userId });

        if (!referral) {
            return res.status(404).json({
                success: false,
                message: 'Referral not found'
            });
        }

        await referral.completeReferral(userId, bookingId);

        // Add booking bonus points to both users
        const [referrerLoyalty, referredLoyalty] = await Promise.all([
            LoyaltyPoints.findOne({ user: referral.referrer }),
            LoyaltyPoints.findOne({ user: userId })
        ]);

        if (referrerLoyalty) {
            await referrerLoyalty.addPoints(
                referral.rewards.referrerBonus,
                'Referral booking bonus (referrer)'
            );
        }

        if (referredLoyalty) {
            await referredLoyalty.addPoints(
                referral.rewards.bookingBonus,
                'Referral booking bonus (first booking)'
            );
        }

        res.status(200).json({
            success: true,
            data: referral
        });
    } catch (error) {
        logger.error('Error completing referral:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error completing referral'
        });
    }
};

// Get user's referral info
export const getUserReferrals = async (req, res) => {
    try {
        const referral = await Referral.findOne({ referrer: req.user.id })
            .populate('referrals.user', 'name email')
            .populate('referrals.bookings');

        if (!referral) {
            return res.status(404).json({
                success: false,
                message: 'No referral program found for user'
            });
        }

        res.status(200).json({
            success: true,
            data: referral
        });
    } catch (error) {
        logger.error('Error getting user referrals:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching referral information'
        });
    }
};

// Admin: Get all referrals
export const getAllReferrals = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const referrals = await Referral.find()
            .populate('referrer', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit);

        const total = await Referral.countDocuments();

        res.status(200).json({
            success: true,
            data: referrals,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        logger.error('Error getting all referrals:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching referrals'
        });
    }
};

// Get referral statistics
export const getReferralStats = async (req, res) => {
    try {
        const stats = await Referral.aggregate([
            {
                $group: {
                    _id: null,
                    totalReferrals: { $sum: '$stats.totalReferrals' },
                    successfulReferrals: { $sum: '$stats.successfulReferrals' },
                    totalPointsEarned: { $sum: '$stats.totalPointsEarned' },
                    totalBookings: { $sum: '$stats.totalBookings' },
                    averagePointsPerReferral: {
                        $avg: {
                            $cond: [
                                { $gt: ['$stats.successfulReferrals', 0] },
                                { $divide: ['$stats.totalPointsEarned', '$stats.successfulReferrals'] },
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: stats[0] || {
                totalReferrals: 0,
                successfulReferrals: 0,
                totalPointsEarned: 0,
                totalBookings: 0,
                averagePointsPerReferral: 0
            }
        });
    } catch (error) {
        logger.error('Error getting referral stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching referral statistics'
        });
    }
}; 