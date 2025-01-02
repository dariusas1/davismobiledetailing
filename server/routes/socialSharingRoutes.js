const express = require('express');
const router = express.Router();
const User = require('../models/User');
const SocialShare = require('../models/SocialShare');
const { authenticateToken } = require('../middleware/authMiddleware');

// Social Sharing Configurations
const SOCIAL_SHARING_REWARDS = {
    facebook: 50,   // Points for Facebook share
    twitter: 40,    // Points for Twitter share
    instagram: 60,  // Points for Instagram share
    linkedin: 30    // Points for LinkedIn share
};

// Generate Shareable Content
router.get('/share-content', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate unique share token
        const shareToken = crypto.randomBytes(16).toString('hex');

        // Create social share record
        const socialShare = new SocialShare({
            user: user._id,
            shareToken,
            platforms: Object.keys(SOCIAL_SHARING_REWARDS),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours expiry
        });

        await socialShare.save();

        // Prepare shareable content
        const shareContent = {
            title: `I just got my car detailed by Precision Detailing!`,
            description: `Professional mobile detailing service in Santa Cruz. Book now and get amazing results!`,
            shareUrl: `https://precisiondetailing.com/share/${shareToken}`,
            platforms: Object.keys(SOCIAL_SHARING_REWARDS)
        };

        res.json(shareContent);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error generating share content', 
            error: error.message 
        });
    }
});

// Validate Social Share and Award Points
router.post('/validate-share', authenticateToken, async (req, res) => {
    try {
        const { shareToken, platform } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find and validate social share
        const socialShare = await SocialShare.findOne({
            shareToken,
            user: user._id,
            platforms: platform,
            used: false,
            expiresAt: { $gt: new Date() }
        });

        if (!socialShare) {
            return res.status(400).json({ message: 'Invalid or expired share token' });
        }

        // Award loyalty points
        const pointsAwarded = SOCIAL_SHARING_REWARDS[platform];
        user.loyaltyPoints += pointsAwarded;
        
        // Mark share as used
        socialShare.used = true;
        socialShare.usedAt = new Date();
        socialShare.platformUsed = platform;

        await user.save();
        await socialShare.save();

        res.json({
            message: 'Share validated successfully',
            pointsAwarded,
            newLoyaltyPoints: user.loyaltyPoints
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error validating social share', 
            error: error.message 
        });
    }
});

// Referral Program
router.post('/referral', authenticateToken, async (req, res) => {
    try {
        const { referredEmail } = req.body;
        const referrer = await User.findById(req.user.id);

        if (!referrer) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if email is already registered
        const existingUser = await User.findOne({ email: referredEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Generate referral token
        const referralToken = crypto.randomBytes(16).toString('hex');

        // Create referral record
        const referral = new Referral({
            referrer: referrer._id,
            referredEmail,
            referralToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days expiry
        });

        await referral.save();

        // Send referral email
        await sendReferralEmail(referredEmail, {
            referrerName: referrer.profile.firstName,
            referralLink: `https://precisiondetailing.com/signup?ref=${referralToken}`
        });

        res.json({
            message: 'Referral invitation sent successfully',
            referralToken
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error processing referral', 
            error: error.message 
        });
    }
});

module.exports = router;
